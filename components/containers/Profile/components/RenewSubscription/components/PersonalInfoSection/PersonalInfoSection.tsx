import { PhoneNumberInput, TextInput } from "@/components/ui";
import { Colors } from "@/constants";
import { useLocale } from "@/hooks";
import React from "react";
import { View } from "react-native";
import { PersonalInfoSectionProps } from "./props";

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  control,
}) => {
  const { t } = useLocale();

  return (
    <View>
      <TextInput
        name="name"
        inputMode="text"
        control={control}
        autoCorrect={false}
        label={t("fullName")}
        placeholder={t("enterFullName")}
      />

      <PhoneNumberInput
        name="phone"
        control={control}
        label={t("phoneNumber")}
        placeholder="+966 XX XXX XXXX"
        defaultCode="PK"
      />

      <TextInput
        name="price"
        inputMode="numeric"
        control={control}
        autoCorrect={false}
        label={t("itemValue")}
        placeholder="XXXX"
        endButtonText={t("renewSubscription")}
        endButtonProps={{
          variant: "danger",
          style: {
            backgroundColor: Colors.background,
          },
          textStyle: {
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
        label={t("selectDate")}
        placeholder="DD/MM/YY"
      />

      <TextInput
        name="endDate"
        inputMode="numeric"
        control={control}
        autoCorrect={false}
        label={t("selectDate")}
        placeholder="DD/MM/YY"
      />
    </View>
  );
};
