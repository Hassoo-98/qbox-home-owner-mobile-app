import { PasswordInput, PhoneNumberInput, TextInput } from "@/components/ui";
import { useLocale } from "@/hooks";
import React from "react";
import { View } from "react-native";
import { BasicInformationProps } from "./props";

export const BasicInformation = ({ control }: BasicInformationProps) => {
  const { t } = useLocale();

  return (
    <View>
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
        label={t("emailAddress")}
        keyboardType="email-address"
        placeholder={t("enterEmailAddress")}
      />
      <PhoneNumberInput
        name="phone"
        control={control}
        label={t("phoneNumber")}
        placeholder="+966 XX XXX XXXX"
        defaultCode="PK"
      />

      <PhoneNumberInput
        name="secondaryPhone"
        control={control}
        label={t("secondaryNumber")}
        placeholder="+966 XX XXX XXXX"
        defaultCode="PK"
      />

      <PasswordInput
        name="password"
        control={control}
        label={t("password")}
        placeholder={t("enterNewPassword")}
      />

      <PasswordInput
        name="confirmPassword"
        control={control}
        label={t("retypePassword")}
        placeholder={t("enterConfirmPassword")}
      />
    </View>
  );
};
