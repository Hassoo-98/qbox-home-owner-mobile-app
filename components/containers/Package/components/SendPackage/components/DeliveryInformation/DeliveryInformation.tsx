import { PaymentSection } from "@/components/common";
import { CustomDropdown } from "@/components/ui/Dropdown";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { PackageOrderPaymentSummary } from "../PackageOrderPaymentSummary";
import { DeliveryInformationProps } from "./props";


export const DeliveryInformation = ({ control, setValue }: DeliveryInformationProps) => {
  const [method, setMethod] = useState<"card" | "stc">("card");

  const handlePaymentMethodChange = (newMethod: "card" | "stc") => {
    setMethod(newMethod);
  };

  const paymentSummary = {
    paymentMethod: "Credit Card",
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

  useEffect(() => {
    const total = paymentSummary.charges.reduce((sum, item) => sum + item.value, 0);
    setValue("paymentMethod", paymentSummary.paymentMethod);
    setValue("charges", total);
  }, []);

  return (
    <View>
      <CustomDropdown
        name="shippingCompany"
        control={control}
        label="Shipping Company"
        placeholder="Choose package type"
        options={[
          { label: "ABC", value: "mainDoor" },
          { label: "XYX", value: "gate" },
          { label: "BASD", value: "entrance" },
        ]}
      />

      <View>
        <PackageOrderPaymentSummary paymentSummary={paymentSummary} />
        <PaymentSection control={control} setValue={setValue} />
      </View>
    </View>
  );
};
