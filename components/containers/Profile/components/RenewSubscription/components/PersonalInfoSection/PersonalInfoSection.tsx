import { PhoneNumberInput, TextInput } from "@/components/ui";
import { Colors } from "@/constants";
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
        endButtonText="Yearly"
        endButtonProps={{
          variant: "danger", // change background
          style: {
            backgroundColor: Colors.background,
          },
          textStyle: {
            // control the text inside the button
            color: Colors.text,
            fontWeight: "bold",
            borderLeftColor: Colors.text,
            paddingLeft: 5,
            borderLeftWidth: 1,
          },
        }}
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
