import { RadioButton } from "@/components";
import { Colors } from "@/constants";
import React from "react";
import { View } from "react-native";
import { PaymentMethodSectionProps } from "./props";

export const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  method,
  onMethodChange,
}) => {
  return (
    <View
      style={{
        paddingHorizontal: 8,
        borderTopColor: Colors.border,
        borderTopWidth: 2,
        marginTop: 16,
      }}
    >
      <RadioButton
        title="STC Payment"
        subtitle="Digital wallet payment"
        selected={method === "stc"}
        onPress={() => onMethodChange("stc")}
      />

      <RadioButton
        title="Credit/Debit Card"
        subtitle="Visa, Mastercard, Mada"
        selected={method === "card"}
        onPress={() => onMethodChange("card")}
      />
    </View>
  );
};
