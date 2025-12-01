import { PhoneNumberInput, TextInput } from "@/components";
import { MenuItem } from "@/components/containers/Profile";
import { AUTH_PROVIDERS, Colors, emailPattern } from "@/constants";
import { useModal } from "@/hooks";
import { mvs } from "@/utils/metrices";
import { useLocalSearchParams } from "expo-router";
import {
  isValidPhoneNumber,
  parsePhoneNumberWithError,
} from "libphonenumber-js";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView } from "react-native";

export const BasicInformation = () => {
  const { control, watch, handleSubmit } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      secondaryPhone: "",
    },
  });

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
      onOTPResend: () => console.log("Resend OTP"),
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

  const onSubmit = handleSubmit((data) =>
    console.log(
      "this is the Basic information form data ",
      JSON.stringify(data, null, 4)
    )
  );

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
        name="phone"
        control={control}
        label="Phone Number"
        placeholder="+966 XX XXX XXXX"
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
        name="secondaryPhone"
        control={control}
        label="Secondary Number"
        placeholder="+966 XX XXX XXXX"
        defaultCode="PK"
      />

      <MenuItem title="Password" path="/passwordManager" />
    </ScrollView>
  );
};

export default BasicInformation;
