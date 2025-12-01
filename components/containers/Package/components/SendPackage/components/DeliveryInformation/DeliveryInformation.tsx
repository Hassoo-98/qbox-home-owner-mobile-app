import { PaymentSection } from "@/components/common";
import { SelectField } from "@/components/ui";
import React, { useState } from "react";
import { View } from "react-native";
import { PackageOrderPaymentSummary } from "../PackageOrderPaymentSummary";
import { DeliveryInformationProps } from "./props";

export const DeliveryInformation = ({ control }: DeliveryInformationProps) => {
  const [method, setMethod] = useState<"card" | "stc">("card");

  const handlePaymentMethodChange = (newMethod: "card" | "stc") => {
    setMethod(newMethod);
  };

  const paymentSummary = {
    paymentMethod: "Apple Pay",
    charges: [
      {
        key: "Base delivery fee (First 5 Kg’s)",
        value: 5,
      },
      {
        key: "Additional per Kg",
        value: 10,
      },
      {
        key: "Tax Fuel",
        value: 5,
      },
    ],
    currency: "SAR",
  };
  return (
    <View>
      <SelectField
        name="shippingCompany"
        control={control}
        label="Ship[ing Company"
        placeholder="Choose package type"
        options={[
          { label: "ABC", value: "mainDoor" },
          { label: "XYX", value: "gate" },
          { label: "BASD", value: "entrance" },
        ]}
      />

      <View>
        <PackageOrderPaymentSummary paymentSummary={paymentSummary} />
        <PaymentSection control={control} />
      </View>
    </View>
  );
};
