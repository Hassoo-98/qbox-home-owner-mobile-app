import { PhoneNumberInput, TextInput } from "@/components/ui";
import React from "react";
import { View } from "react-native";
import { RecipientInformationProps } from "./props";

export const RecipientInformation = ({
  control,
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
      />
      <PhoneNumberInput
        name="phone"
        control={control}
        label="Phone Number"
        placeholder="+966 XX XXX XXXX"
        defaultCode="PK"
      />
      <TextInput
        name="qBoxId"
        inputMode="text"
        control={control}
        autoCorrect={false}
        label="QBox ID"
        placeholder="XXXXXX"
      />
    </View>
  );
};
