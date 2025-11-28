import { PhoneNumberInput, TextInput } from "@/components/ui";
import React from "react";
import { View } from "react-native";
import { PersonalInfoSectionProps } from "./props";

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  control,
}) => {
  return (
    <View>
      <TextInput
        name="name"
        inputMode="text"
        control={control}
        autoCorrect={false}
        label="Name"
        placeholder="Enter Your Name"
      />

      <PhoneNumberInput
        name="phone"
        control={control}
        label="Phone Number"
        placeholder="+966 XX XXX XXXX"
        defaultCode="PK"
      />

      <TextInput
        name="price"
        inputMode="numeric"
        control={control}
        autoCorrect={false}
        label="Price"
        placeholder="XXXX"
      />

      <TextInput
        name="startDate"
        inputMode="numeric"
        control={control}
        autoCorrect={false}
        label="Start Date"
        placeholder="DD/MM/YY"
      />

      <TextInput
        name="endDate"
        inputMode="numeric"
        control={control}
        autoCorrect={false}
        label="End Date"
        placeholder="DD/MM/YY"
      />
    </View>
  );
};
