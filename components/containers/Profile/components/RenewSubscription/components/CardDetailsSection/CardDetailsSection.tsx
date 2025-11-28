import { TextInput } from "@/components/ui";
import { Colors } from "@/constants";
import { mvs } from "@/utils/metrices";
import React from "react";
import { View } from "react-native";
import { CardDetailsSectionProps } from "./props";

export const CardDetailsSection: React.FC<CardDetailsSectionProps> = ({
  control,
}) => {
  return (
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
  );
};
