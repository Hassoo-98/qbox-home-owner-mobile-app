import {
  CardDetailsSection,
  PaymentMethodSection,
  PersonalInfoSection,
} from "@/components/containers/Profile/components/RenewSubscription";
import { RenewSubscriptionFormData } from "@/types";
import { RenewSubscriptionResolver } from "@/utils";
import { mvs } from "@/utils/metrices";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

export const RenewSubscription = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RenewSubscriptionFormData>({
    defaultValues: {
      name: "",
      phone: "",
      price: "",
      startDate: "",
      endDate: "",
      paymentMethod: "card",
      cardHolderName: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
    },
    resolver: RenewSubscriptionResolver,
    mode: "onChange",
  });

  const [method, setMethod] = useState<"card" | "stc">("card");

  const handlePaymentMethodChange = (newMethod: "card" | "stc") => {
    setMethod(newMethod);
    setValue("paymentMethod", newMethod);
  };

  const onSubmit = (data: RenewSubscriptionFormData) => {
    console.log("Form Data:", data);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, padding: mvs(20) }}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
        >
          <PersonalInfoSection control={control} />

          <PaymentMethodSection
            method={method}
            onMethodChange={handlePaymentMethodChange}
          />

          {method === "card" && <CardDetailsSection control={control} />}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RenewSubscription;
