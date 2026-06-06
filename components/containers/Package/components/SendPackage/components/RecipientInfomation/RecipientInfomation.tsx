import { PhoneNumberInput, TextInput } from "@/components/ui";
import { useLocale } from "@/hooks";
import React from "react";
import { View } from "react-native";
import { RecipientInformationProps } from "./props";

export const RecipientInformation = ({
  control,
  onVerifyQBox,
  isVerifyingQBox,
  isQBoxVerified,
}: RecipientInformationProps) => {
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
        editable={false}
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
        editable={false}
      />
      <PhoneNumberInput
        name="phone"
        control={control}
        label={t("phoneNumber")}
        placeholder="+966 XX XXX XXXX"
        defaultCode="PK"
        disableCountryPicker
        editable={false}
      />
      <TextInput
        name="qBoxId"
        inputMode="text"
        control={control}
        autoCorrect={false}
        label="QBox ID"
        placeholder="XXXXXX"
        autoCapitalize="characters"
        endButtonText={isQBoxVerified ? t("verified") : t("verify")}
        onEndButtonClick={onVerifyQBox}
        endButtonProps={{
          size: "sm",
          variant: isQBoxVerified ? "success" : "primary",
          loading: isVerifyingQBox,
          disabled: isVerifyingQBox || isQBoxVerified,
        }}
      />
    </View>
  );
};
