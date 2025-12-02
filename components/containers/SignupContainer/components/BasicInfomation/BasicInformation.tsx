import { PasswordInput, PhoneNumberInput, TextInput } from "@/components/ui";
import React from "react";
import { View } from "react-native";
import { BasicInformationProps } from "./props";

export const BasicInformation = ({ control }: BasicInformationProps) => {
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

      <PhoneNumberInput
        name="secondaryPhone"
        control={control}
        label="Secondary Number"
        placeholder="+966 XX XXX XXXX"
        defaultCode="PK"
      />

      <PasswordInput
        name="password"
        control={control}
        label="Password"
        placeholder="Enter password"
      />

      <PasswordInput
        name="confirmPassword"
        control={control}
        label="Confirm Password"
        placeholder="Enter password"
      />
    </View>
  );
};
