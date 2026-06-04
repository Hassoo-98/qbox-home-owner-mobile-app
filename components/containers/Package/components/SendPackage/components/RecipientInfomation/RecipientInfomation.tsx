import { PhoneNumberInput, TextInput } from "@/components/ui";
import React from "react";
import { View } from "react-native";
import { RecipientInformationProps } from "./props";

export const RecipientInformation = ({
  control,
  onVerifyQBox,
  isVerifyingQBox,
  isQBoxVerified,
}: RecipientInformationProps) => {
  return (
    <View>
      <TextInput
        name="fullName"
        inputMode="text"
        control={control}
        autoCapitalize="words"
        autoCorrect={false}
        label="Full Name"
        autoComplete="name"
        placeholder="Enter your full name"
        editable={false}
      />
      <TextInput
        name="email"
        inputMode="email"
        control={control}
        autoCapitalize="none"
        autoComplete="email"
        label="Email Address"
        keyboardType="email-address"
        placeholder="Enter email address"
        editable={false}
      />
      <PhoneNumberInput
        name="phone"
        control={control}
        label="Phone Number"
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
        endButtonText={isQBoxVerified ? "Verified" : "Verify"}
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
