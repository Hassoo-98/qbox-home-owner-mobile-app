import { MenuItem } from "@/components/containers/Profile";
import { PhoneNumberInput, Skeleton, TextInput } from "@/components";
import { Colors } from "@/constants";
import { useLocale, useModal, useProfile, useVerification } from "@/hooks";
import { useUpdateHomeOwner } from "@/hooks/api/useHomeOwnerQueries";
import { useHomeOwner } from "@/hooks/useHomeOwner";
import { BasicInformationFormValues } from "@/types";
import { BasicInformationFormResolver } from "@/utils";
import { mvs } from "@/utils/metrices";
import { isValidPhoneNumber, parsePhoneNumberWithError } from "libphonenumber-js";
import { useForm } from "react-hook-form";
import { Alert, ScrollView, View } from "react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Toast } from "toastify-react-native";

const normalizePhone = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("+") ? trimmed.replace(/\s+/g, "") : `+${trimmed.replace(/\s+/g, "")}`;
};

const normalizeEmail = (value: string) => value.trim().toLowerCase();

const extractErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === "object" && error !== null) {
    const maybeError = error as {
      response?: { data?: { message?: string; detail?: string } };
      message?: string;
    };

    return (
      maybeError.response?.data?.message ||
      maybeError.response?.data?.detail ||
      maybeError.message ||
      fallback
    );
  }

  return fallback;
};

export const BasicInformation = () => {
  const { t } = useLocale();
  const { setOnSave, setIsSaving } = useProfile();
  const { data: homeOwnerResponse, isLoading: profileLoading } = useHomeOwner();
  const userProfile = homeOwnerResponse?.data;
  const homeOwnerId = userProfile?.id;
  const { mutateAsync: updateHomeOwner } = useUpdateHomeOwner(homeOwnerId || "");
  const { sendOtp, verifyOtp, isSendingOtp } = useVerification();
  const { onTriggerModal } = useModal();

  const { control, watch, handleSubmit, reset } = useForm<BasicInformationFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      secondaryPhone: "",
    },
    resolver: BasicInformationFormResolver,
    mode: "onChange",
  });

  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [verifiedPhone, setVerifiedPhone] = useState("");
  const originalEmailRef = useRef("");
  const originalPhoneRef = useRef("");
  const [verificationChannel, setVerificationChannel] = useState<"email" | "phone" | null>(null);

  useEffect(() => {
    if (!userProfile) return;

    const nextEmail = userProfile.email || "";
    const nextPhone = userProfile.phone_number || "";

    reset({
      fullName: userProfile.full_name || "",
      email: nextEmail,
      phone: nextPhone,
      secondaryPhone: userProfile.secondary_phone_number || "",
    });

    originalEmailRef.current = nextEmail;
    originalPhoneRef.current = nextPhone;
    setVerifiedEmail(nextEmail);
    setVerifiedPhone(nextPhone);
  }, [reset, userProfile]);

  const email = watch("email");
  const phone = watch("phone");

  const currentEmailVerified = useMemo(() => {
    const current = normalizeEmail(email || "");
    const verified = normalizeEmail(verifiedEmail || "");
    const original = normalizeEmail(originalEmailRef.current || "");

    return current === verified || current === original;
  }, [email, verifiedEmail]);

  const isEmailValid = useMemo(
    () => {
      const value = email.trim();
      return value.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    },
    [email]
  );

  const currentPhoneVerified = useMemo(() => {
    const current = normalizePhone(phone || "");
    const verified = normalizePhone(verifiedPhone || "");
    const original = normalizePhone(originalPhoneRef.current || "");

    return current === verified || current === original;
  }, [phone, verifiedPhone]);

  const isPhoneValid = useMemo(() => {
    const value = phone.trim();
    if (!value || value.length > 15) return false;

    const candidate = value.startsWith("+") ? value : `+${value}`;

    try {
      const parsed = parsePhoneNumberWithError(candidate);
      return isValidPhoneNumber(candidate, parsed.country);
    } catch {
      return false;
    }
  }, [phone]);

  const emailButtonConfig = useMemo(() => {
    if (currentEmailVerified) {
      return {
        text: t("verified"),
        disabled: true,
      };
    }

    return {
      text: t("verify"),
      disabled: !isEmailValid || (isSendingOtp && verificationChannel === "email"),
    };
  }, [currentEmailVerified, isEmailValid, isSendingOtp, t, verificationChannel]);

  const phoneButtonConfig = useMemo(() => {
    if (currentPhoneVerified) {
      return {
        text: t("verified"),
        disabled: true,
      };
    }

    return {
      text: t("verify"),
      disabled: !isPhoneValid || (isSendingOtp && verificationChannel === "phone"),
    };
  }, [currentPhoneVerified, isPhoneValid, isSendingOtp, t, verificationChannel]);

  const openOtpModal = useCallback(
    async (type: "email" | "phone") => {
      const rawValue = (type === "email" ? email : phone).trim();

      if (!rawValue) {
        Alert.alert(t("error"), type === "email" ? t("enterEmailAddress") : t("enterPhoneNumber"));
        return;
      }

      if (type === "email" && !isEmailValid) {
        Alert.alert(t("error"), t("enterEmailAddress"));
        return;
      }

      if (type === "phone" && !isPhoneValid) {
        Alert.alert(t("error"), t("enterPhoneNumber"));
        return;
      }

      if (type === "email") {
        if (normalizeEmail(rawValue) === normalizeEmail(originalEmailRef.current)) {
          setVerifiedEmail(originalEmailRef.current);
          return;
        }
      } else if (normalizePhone(rawValue) === normalizePhone(originalPhoneRef.current)) {
        setVerifiedPhone(originalPhoneRef.current);
        return;
      }

      const payload =
        type === "email"
          ? {
              email: normalizeEmail(rawValue),
              verification_type: "email" as const,
              is_home_owner: true,
              is_forget_otp: false,
            }
          : {
              phone_number: normalizePhone(rawValue),
              verification_type: "phone_number" as const,
              is_home_owner: true,
              is_forget_otp: false,
            };

      setVerificationChannel(type);

      try {
        await sendOtp(payload);
      } catch (error) {
        setVerificationChannel(null);
        Alert.alert(t("error"), extractErrorMessage(error, t("error")));
        return;
      }

      onTriggerModal({
        modalType: "otp",
        title: t("otpVerification"),
        subtitle: type === "email" ? t("enterEmailOtp") : t("enterPhoneOtp"),
        footerText: t("didntReceiveTheCode"),
        footerAction: t("resendOtp"),
        primaryButtonText: t("verify"),
        secondaryButtonHandler: async () => {
          await sendOtp(payload);
          return false;
        },
        primaryButtonHandler: async (otpValue?: string) => {
          const otp = String(otpValue || "").trim();
          if (!otp) {
            Alert.alert(t("error"), t("otpRequired"));
            return false;
          }

          try {
            await verifyOtp(
              type === "email"
                ? { email: normalizeEmail(rawValue), otp }
                : { phone_number: normalizePhone(rawValue), otp }
            );
          } catch (error) {
            Alert.alert(t("error"), extractErrorMessage(error, t("error")));
            return false;
          }

          if (type === "email") {
            setVerifiedEmail(normalizeEmail(rawValue));
            Toast.show({
              type: "success",
              text1: t("emailVerifiedSuccessfully"),
              position: "top",
              backgroundColor: Colors.white,
              textColor: Colors.text,
              progressBarColor: Colors.success,
              visibilityTime: 3000,
            });
          } else {
            setVerifiedPhone(normalizePhone(rawValue));
            Toast.show({
              type: "success",
              text1: t("phoneVerifiedSuccessfully"),
              position: "top",
              backgroundColor: Colors.white,
              textColor: Colors.text,
              progressBarColor: Colors.success,
              visibilityTime: 3000,
            });
          }

          return true;
        },
      });
    },
    [email, isEmailValid, isPhoneValid, onTriggerModal, phone, sendOtp, t, verifyOtp]
  );

  const submitHandler = useCallback(
    async (data: BasicInformationFormValues) => {
      if (!homeOwnerId) {
        Alert.alert(t("error"), t("failedToUpdateProfile"));
        return;
      }

      if (!data.fullName || data.fullName.trim().length < 3) {
        Alert.alert(t("error"), t("nameAndEmailRequired"));
        return;
      }

      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        Alert.alert(t("error"), t("enterEmailAddress"));
        return;
      }

      if (!data.phone || normalizePhone(data.phone).length > 15) {
        Alert.alert(t("error"), t("enterPhoneNumber"));
        return;
      }

      const emailChanged = normalizeEmail(data.email) !== normalizeEmail(originalEmailRef.current);
      const phoneChanged = normalizePhone(data.phone) !== normalizePhone(originalPhoneRef.current);

      if (emailChanged && !currentEmailVerified) {
        Alert.alert(t("error"), t("verifyCurrentEmailBeforeSaving"));
        return;
      }

      if (phoneChanged && !currentPhoneVerified) {
        Alert.alert(t("error"), t("verifyCurrentPhoneBeforeSaving"));
        return;
      }

      try {
        setIsSaving(true);
        const payload = {
          full_name: data.fullName.trim(),
          email: normalizeEmail(data.email),
          phone_number: normalizePhone(data.phone),
          secondary_phone_number: data.secondaryPhone ? normalizePhone(data.secondaryPhone) : undefined,
        };

        console.log("[BasicInformation] updateHomeOwner request", {
          homeOwnerId,
          payload,
        });

        const response = await updateHomeOwner(payload);
        console.log("[BasicInformation] updateHomeOwner response", response);

        reset({
          fullName: data.fullName.trim(),
          email: normalizeEmail(data.email),
          phone: normalizePhone(data.phone),
          secondaryPhone: data.secondaryPhone ? normalizePhone(data.secondaryPhone) : "",
        });
        originalEmailRef.current = normalizeEmail(data.email);
        originalPhoneRef.current = normalizePhone(data.phone);
        setVerifiedEmail(normalizeEmail(data.email));
        setVerifiedPhone(normalizePhone(data.phone));

        Toast.show({
          type: "success",
          text1: t("profileUpdatedSuccessfully"),
          position: "top",
          backgroundColor: Colors.white,
          textColor: Colors.text,
          progressBarColor: Colors.success,
          visibilityTime: 3000,
        });
      } catch (error: unknown) {
        console.log("[BasicInformation] updateHomeOwner error", error);
        Alert.alert(t("error"), extractErrorMessage(error, t("failedToUpdateProfile")));
      } finally {
        setIsSaving(false);
      }
    },
    [currentEmailVerified, currentPhoneVerified, homeOwnerId, reset, setIsSaving, t, updateHomeOwner]
  );

  const onSaveProfile = useMemo(() => handleSubmit(submitHandler), [handleSubmit, submitHandler]);

  useEffect(() => {
    setOnSave(() => onSaveProfile);
    return () => setOnSave(null);
  }, [onSaveProfile, setOnSave]);

  if (profileLoading) {
    return (
      <View style={{ flex: 1, padding: mvs(20) }}>
        <Skeleton width="40%" height={20} style={{ marginBottom: 10, alignSelf: "flex-start" }} />
        <Skeleton width="100%" height={50} variant="rounded" style={{ marginBottom: 20 }} />
        <Skeleton width="40%" height={20} style={{ marginBottom: 10, alignSelf: "flex-start" }} />
        <Skeleton width="100%" height={50} variant="rounded" style={{ marginBottom: 20 }} />
        <Skeleton width="40%" height={20} style={{ marginBottom: 10, alignSelf: "flex-start" }} />
        <Skeleton width="100%" height={50} variant="rounded" style={{ marginBottom: 20 }} />
        <Skeleton width="40%" height={20} style={{ marginBottom: 10, alignSelf: "flex-start" }} />
        <Skeleton width="100%" height={50} variant="rounded" style={{ marginBottom: 20 }} />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: "center",
        padding: mvs(20),
      }}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled
    >
      <TextInput
        name="fullName"
        inputMode="text"
        control={control}
        autoCapitalize="words"
        autoCorrect={false}
        label={t("fullName")}
        autoComplete="name"
        placeholder={t("enterFullName")}
      />

      <TextInput
        name="email"
        inputMode="email"
        control={control}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        label={t("emailAddress")}
        placeholder={t("enterEmailAddress")}
        endButtonText={emailButtonConfig.text}
        endButtonProps={{
          variant: currentEmailVerified ? "success" : "primary",
          disabled: emailButtonConfig.disabled,
          loading: isSendingOtp && verificationChannel === "email",
        }}
        onEndButtonClick={() => openOtpModal("email")}
      />

      <PhoneNumberInput
        name="phone"
        control={control}
        label={t("phoneNumber")}
        placeholder={t("enterPhoneNumber")}
        defaultCode="PK"
        disableCountryPicker
        endButtonText={phoneButtonConfig.text}
        endButtonProps={{
          variant: currentPhoneVerified ? "success" : "primary",
          disabled: phoneButtonConfig.disabled,
          loading: isSendingOtp && verificationChannel === "phone",
        }}
        onEndButtonClick={() => openOtpModal("phone")}
      />

      <PhoneNumberInput
        name="secondaryPhone"
        control={control}
        label={t("secondaryNumber")}
        disableCountryPicker
        placeholder={t("enterSecondaryNumber")}
        defaultCode="PK"
      />

      <MenuItem title={t("password")} path="/passwordManager" />
    </ScrollView>
  );
};

export default BasicInformation;
