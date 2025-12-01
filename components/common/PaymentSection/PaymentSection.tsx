import { RadioButton, Text, TextInput } from "@/components";
import { Colors } from "@/constants";
import { mvs } from "@/utils/metrices";
import React, { useState } from "react";
import { Control } from "react-hook-form";
import { View } from "react-native";

interface PaymentSectionProps {
  control: Control<any>;
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({ control }) => {
  const [method, setMethod] = useState<"card" | "stc">("card");

  return (
    <View
      style={{
        paddingHorizontal: 8,
        borderTopColor: Colors.border,
        borderTopWidth: 2,
        marginTop: 16,
        paddingTop: mvs(10),
      }}
    >
      <Text bold>Payment summary</Text>

      <RadioButton
        title="STC Payment"
        subtitle="Digital wallet payment"
        selected={method === "stc"}
        onPress={() => setMethod("stc")}
      />

      <RadioButton
        title="Credit/Debit Card"
        subtitle="Visa, Mastercard, Mada"
        selected={method === "card"}
        onPress={() => setMethod("card")}
      />

      {method === "card" && (
        <View
          style={{
            padding: mvs(20),
            backgroundColor: Colors.gray,
            borderRadius: mvs(10),
            marginTop: 16,
          }}
        >
          <TextInput
            name="cardHolderName"
            inputMode="text"
            control={control}
            autoCorrect={false}
            label="Card Holder Name"
            placeholder="Write card holder name"
          />

          <TextInput
            name="cardNumber"
            inputMode="numeric"
            control={control}
            autoCorrect={false}
            label="Card Number"
            placeholder="XXXX XXXX XXXX XXXX"
            maxLength={19}
          />

          <View style={{ flexDirection: "row", gap: 10 }}>
            <TextInput
              name="expiry"
              inputMode="numeric"
              control={control}
              label="Expiry"
              placeholder="MM/YYYY"
              width="48%"
              maxLength={7}
            />

            <TextInput
              name="cvv"
              inputMode="numeric"
              control={control}
              label="CVV"
              placeholder="XXX"
              width="48%"
              maxLength={4}
              secureTextEntry
            />
          </View>
        </View>
      )}
    </View>
  );
};
