import { PhoneNumberInput, Skeleton, TextInput } from "@/components";
import { MenuItem } from "@/components/containers/Profile";
import { AUTH_PROVIDERS, Colors, emailPattern } from "@/constants";
import { useModal } from "@/hooks";
import { useUpdateHomeOwner } from "@/hooks/api/useHomeOwnerQueries";
import { useHomeOwner } from "@/hooks/useHomeOwner";
import { useProfile } from "@/hooks/useProfile";
import { mvs } from "@/utils/metrices";
import { router, useLocalSearchParams } from "expo-router";
import {
  isValidPhoneNumber,
  parsePhoneNumberWithError,
} from "libphonenumber-js";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, ScrollView, View } from "react-native";

export const BasicInformation = () => {
  const { setOnSave } = useProfile();
  const { data: homeOwnerResponse, isLoading: profileLoading } = useHomeOwner();
  const userProfile = homeOwnerResponse?.data;
  const { mutateAsync: updateHomeOwner } = useUpdateHomeOwner(userProfile?.id || "");

  const { control, watch, handleSubmit, reset } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      secondaryPhone: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (userProfile) {
      reset({
        fullName: userProfile.full_name,
        email: userProfile.email,
        phone: userProfile.phone_number,
        secondaryPhone: userProfile.secondary_phone_number || "",
      });
    }
  }, [userProfile, reset]);

  const { onTriggerModal } = useModal();

  const email = watch("email");
  const phone = watch("phone");
  const params = useLocalSearchParams();

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  const isEmailValid = useMemo(
    () => email?.trim() !== "" && emailPattern.test(email?.trim()),
    [email]
  );

  const isPhoneValid = useMemo(() => {
    if (!phone) return false;
    const value = phone.startsWith("+") ? phone : `+${phone}`;

    try {
      const phoneNumber = parsePhoneNumberWithError(value);
      return isValidPhoneNumber(value, phoneNumber.country as any);
    } catch {
      return false;
    }
  }, [phone]);

  const createVerifyButtonConfig = useCallback(
    (isValid: boolean, isVerified: boolean) => {
      if (isVerified) {
        return {
          text: "Verified!",
          variant: "transparent" as const,
          textColor: Colors.success,
          backgroundColor: "transparent",
          disabled: true,
          opacity: 1,
        };
      }

      if (!isValid) {
        return {
          text: "Verify",
          variant: "primary" as const,
          textColor: Colors.white,
          backgroundColor: Colors.secondaryText,
          disabled: true,
          opacity: 0.5,
        };
      }

      return {
        text: "Verify",
        variant: "primary" as const,
        textColor: Colors.white,
        backgroundColor: Colors.primary,
        disabled: false,
        opacity: 1,
      };
    },
    []
  );

  const emailButtonConfig = createVerifyButtonConfig(
    isEmailValid,
    isEmailVerified
  );
  const phoneButtonConfig = createVerifyButtonConfig(
    isPhoneValid,
    isPhoneVerified
  );

  const handleVerify = (type: string) => {
    const subtitle =
      type === "phone"
        ? `Enter the 5-digit code sent to your phone number.`
        : `Enter the 5-digit code sent to your email.`;
    onTriggerModal({
      modalType: "otp",
      title: "OTP Verification",
      subtitle: subtitle,
      footerText: "Didn’t receive the code?",
      footerAction: "Resend OTP",
      primaryButtonText: "Verify",
      secondaryButtonHandler: () => console.log("Resend OTP"),
      primaryButtonHandler: () => {
        if (type === "phone") {
          setIsPhoneVerified(true);
          return;
        }
        setIsEmailVerified(true);
      },
    });
  };

  useEffect(() => {
    if (params?.origin !== "otpVerification") return;

    if (params?.verifiedProvider === AUTH_PROVIDERS.EMAIL) {
      setIsEmailVerified(true);
    } else if (params?.verifiedProvider === AUTH_PROVIDERS.PHONE) {
      setIsPhoneVerified(true);
    }
  }, [params]);

  const submitHandler = useCallback(async (data: any) => {
    try {
      if (!data.fullName || !data.email) {
        Alert.alert("Error", "Name and email are required.");
        return;
      }

      await updateHomeOwner({
        full_name: data.fullName,
        email: data.email,
        phone_number: data.phone,
        secondary_phone_number: data.secondaryPhone,
      });

      Alert.alert("Success", "Profile updated successfully.");
      router.dismiss();
    } catch (error: any) {
      console.error("Profile update failed:", error);
      Alert.alert("Error", error?.response?.data?.message || "Failed to update profile.");
    }
  }, [updateHomeOwner, router]);

  const onSaveProfile = useMemo(() => handleSubmit(submitHandler), [handleSubmit, submitHandler]);

  useEffect(() => {
    setOnSave(() => onSaveProfile);

    return () => setOnSave(null);
  }, [setOnSave, onSaveProfile]);

  if (profileLoading) {
    return (
      <View style={{ flex: 1, padding: mvs(20) }}>
        <Skeleton width="40%" height={20} style={{ marginBottom: 10, alignSelf: 'flex-start' }} />
        <Skeleton width="100%" height={50} variant="rounded" style={{ marginBottom: 20 }} />

        <Skeleton width="40%" height={20} style={{ marginBottom: 10, alignSelf: 'flex-start' }} />
        <Skeleton width="100%" height={50} variant="rounded" style={{ marginBottom: 20 }} />

        <Skeleton width="40%" height={20} style={{ marginBottom: 10, alignSelf: 'flex-start' }} />
        <Skeleton width="100%" height={50} variant="rounded" style={{ marginBottom: 20 }} />

        <Skeleton width="40%" height={20} style={{ marginBottom: 10, alignSelf: 'flex-start' }} />
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
      nestedScrollEnabled={true} // 👈 this alone won't fix the warning but suppresses behavior issues
    >
      <TextInput
        name="fullName"
        inputMode="text"
        control={control}
        autoCapitalize="words"
        autoCorrect={false}
        label="Full Name"
        autoComplete="name"
        placeholder="Enter your full name"
      />

      <TextInput
        name="email"
        inputMode="email"
        control={control}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        label="Email Address"
        placeholder="Enter email address"
        endButtonText={emailButtonConfig.text}
        endButtonProps={{
          variant: emailButtonConfig.variant,
          textStyle: { color: emailButtonConfig.textColor },
          disabled: emailButtonConfig.disabled,
          style: {
            opacity: emailButtonConfig.opacity,
            backgroundColor: emailButtonConfig.backgroundColor,
          },
        }}
        onEndButtonClick={() => handleVerify("email")}
      />

      <PhoneNumberInput
        key={`${userProfile?.phone_number}-primary`}
        name="phone"
        control={control}
        label="Phone Number"
        placeholder="+92 XX XXX XXXX"
        defaultCode="PK"
        defaultValue={userProfile?.phone_number ?? ""}
        value={userProfile?.phone_number ?? ""}
        endButtonText={phoneButtonConfig.text}
        disableCountryPicker={true}
        endButtonProps={{
          variant: phoneButtonConfig.variant,
          textStyle: { color: phoneButtonConfig.textColor },
          disabled: phoneButtonConfig.disabled,
          style: {
            opacity: phoneButtonConfig.opacity,
            backgroundColor: phoneButtonConfig.backgroundColor,
          },
        }}
        onEndButtonClick={() => handleVerify("phone")}
      />

      <PhoneNumberInput
        key={`${userProfile?.secondary_phone_number}-secondary`}
        name="secondaryPhone"
        control={control}
        label="Secondary Number"
        disableCountryPicker={true}
        placeholder="+92 XX XXX XXXX"
        defaultCode="PK"
        // Add these two props:
        defaultValue={userProfile?.secondary_phone_number ?? ""}
        value={userProfile?.secondary_phone_number ?? ""}
      />

      <MenuItem title="Password" path="/passwordManager" />
    </ScrollView>
  );
};

export default BasicInformation;
