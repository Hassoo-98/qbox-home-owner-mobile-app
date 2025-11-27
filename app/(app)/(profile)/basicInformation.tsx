import { PhoneNumberInput, TextInput } from "@/components";
import { MenuItem } from "@/components/containers/Profile";
import { AUTH_PROVIDERS, Colors, emailPattern } from "@/constants";
import { mvs } from "@/utils/metrices";
import { router, useLocalSearchParams } from "expo-router";
import {
  isValidPhoneNumber,
  parsePhoneNumberWithError,
} from "libphonenumber-js";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView } from "react-native";

export const BasicInformation = () => {
  const { control, watch } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      secondaryPhone: "",
    },
  });

  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState<boolean>(false);

  // Watch values
  const email = watch("email");
  const phone = watch("phone");

  const params = useLocalSearchParams();

  // Validation logic
  const isEmailValid = useMemo(() => {
    return email?.trim() !== "" && emailPattern.test(email?.trim() || "");
  }, [email]);

  const isPhoneValid = useMemo(() => {
    // Remove all non-digit characters for validation
    const preFixedValue = phone.startsWith("+") ? phone : `+${phone}`;
    try {
      const phoneNumber = parsePhoneNumberWithError(preFixedValue);
      if (!phoneNumber) return false;
      const isValid = isValidPhoneNumber(
        preFixedValue,
        phoneNumber.country as any
      );
      return isValid;
    } catch (error) {
      console.log("error while validating phone number", error);
      return false;
    }
  }, [phone]);

  // Email button configuration
  const emailButtonConfig = useMemo(() => {
    if (isEmailVerified) {
      return {
        text: "Verified!",
        variant: "transparent" as const,
        textColor: Colors.success,
        backgroundColor: "transparent",
        disabled: true,
        opacity: 1,
      };
    }

    if (!isEmailValid) {
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
  }, [isEmailValid, isEmailVerified]);

  // Phone button configuration
  const phoneButtonConfig = useMemo(() => {
    if (isPhoneVerified) {
      return {
        text: "Verified!",
        variant: "transparent" as const,
        textColor: Colors.success,
        backgroundColor: "transparent",
        disabled: true,
        opacity: 1,
      };
    }

    if (!isPhoneValid) {
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
  }, [isPhoneValid, isPhoneVerified]);

  useEffect(() => {
    if (params?.origin === "otpVerification") {
      const authOption = params?.verifiedProvider;

      if (authOption) {
        if (authOption === AUTH_PROVIDERS.EMAIL) {
          setIsEmailVerified(true);
        } else if (authOption === AUTH_PROVIDERS.PHONE) {
          setIsPhoneVerified(true);
        }
      }
    }
  }, [params]);

  const handleEmailVerify = () => {
    if (!isEmailValid || isEmailVerified) return;

    try {
      router.navigate({
        pathname: "/otpVerification",
        params: {
          authOption: AUTH_PROVIDERS.EMAIL,
          authValue: email.trim(),
          origin: "basicInformation",
        },
      });
    } catch (error) {
      console.error("Email verification navigation error:", error);
    }
  };

  const handlePhoneVerify = () => {
    if (!isPhoneValid || isPhoneVerified) return;

    try {
      router.navigate({
        pathname: "/otpVerification",
        params: {
          authOption: AUTH_PROVIDERS.PHONE,
          authValue: phone,
          origin: "basicInformation",
        },
      });
    } catch (error) {
      console.error("Phone verification navigation error:", error);
    }
  };

  const item = { id: 1, title: "Password", path: "/password" };

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
        onEndButtonClick={handleEmailVerify}
      />

      {/* Phone Number */}
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
        onEndButtonClick={handlePhoneVerify}
      />

      {/* Secondary Phone Number */}
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
