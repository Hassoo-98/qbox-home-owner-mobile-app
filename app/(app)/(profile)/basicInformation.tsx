import { PhoneNumberInput, Skeleton, TextInput } from "@/components";
import { MenuItem } from "@/components/containers/Profile";
import { AUTH_PROVIDERS, Colors, emailPattern } from "@/constants";
import { useModal } from "@/hooks";
import { useUpdateProfileSettings } from "@/hooks/api/useAuthQueries";
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
import { ScrollView, View } from "react-native";

export const BasicInformation = () => {
  const { setOnSave } = useProfile();
  const { data: homeOwnerResponse, isLoading: profileLoading } = useHomeOwner();
  const userProfile = homeOwnerResponse?.data;
  const { mutateAsync: updateProfile } = useUpdateProfileSettings();

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

  const onSubmit = useCallback(async (data: any) => {
    try {
      await updateProfile({
        language: "English", // Defaulting as not available in HomeOwner API
        notifications_enabled: true, // Defaulting as not available in HomeOwner API
      });
      router.dismiss();
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  }, [updateProfile, router]);

  useEffect(() => {
    setOnSave(() => onSubmit);

    // Cleanup isn't strictly necessary if setOnSave handles it, but good practice
    return () => setOnSave(null);
  }, [setOnSave, onSubmit]);

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
        flex: 1,
        alignItems: "center",
        padding: mvs(20),
      }}
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
        endButtonText={phoneButtonConfig.text}
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
        placeholder="+92 XX XXX XXXX"
        defaultCode="PK"
      />

      <MenuItem title="Password" path="/passwordManager" />
    </ScrollView>
  );
};

export default BasicInformation;
