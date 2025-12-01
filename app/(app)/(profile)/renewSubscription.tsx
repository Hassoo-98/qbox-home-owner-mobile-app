import { PaymentSection, PersonalInfoSection } from "@/components";
import { RenewSubscriptionFormData } from "@/types";
import { RenewSubscriptionResolver } from "@/utils";
import { mvs } from "@/utils/metrices";
import React from "react";
import { useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

export const RenewSubscription = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
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

  console.log("this is the form errors :", errors);

  const onSubmit = handleSubmit((data: RenewSubscriptionFormData) => {
    console.log("Form Data:", data);
  });

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

          <PaymentSection control={control} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RenewSubscription;
