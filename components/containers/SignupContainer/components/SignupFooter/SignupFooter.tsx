import { WarningIconOutline } from "@/assets/icons";
import { Button, Text } from "@/components/ui";
import { AUTH_PROVIDERS, Colors, Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import { SignupFooterProps } from "./props";

export const SignupFooter = ({
  currentStep,
  setCurrentStep,
  isFormValid,
  onSubmit,
  phoneNumber,
}: SignupFooterProps) => {
  return (
    <View>
      <View
        style={{
          backgroundColor: Colors.border,
          height: 1,
          width: "100%",
          marginBottom: mvs(Spacing.xl),
        }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: Spacing.md,
        }}
      >
        <Button
          title="Previous"
          disabled={currentStep === 1}
          variant="default"
          onPress={() => {
            setCurrentStep((prev) => --prev);
            router.setParams({ origin: "" });
          }}
        />
        <Button
          title="Next"
          disabled={!isFormValid}
          onPress={() => {
            if (currentStep === 1) {
              router.navigate({
                pathname: "/otpVerification",
                params: {
                  authOption: AUTH_PROVIDERS.PHONE,
                  authValue: phoneNumber,
                  origin: "signup",
                },
              });
            } else if (currentStep < 3) {
              router.setParams({ origin: "" });
              setCurrentStep((prev) => ++prev);
            } else {
              console.log("here");
              onSubmit();
            }
          }}
        />
      </View>

      <View
        style={{
          backgroundColor: Colors.warning,
          paddingVertical: Spacing.md,
          paddingHorizontal: Spacing.lg,
          borderRadius: Spacing.sm,
          flexDirection: "row",
          gap: Spacing.sm,
        }}
      >
        <WarningIconOutline width={20} height={20} />
        <View>
          <Text size="sm" variant="warning" style={{ fontWeight: "bold" }}>
            Your data is secure
          </Text>
          <Text size="sm" variant="warning">
            All information is encrypted and stored securely.
          </Text>
        </View>
      </View>
    </View>
  );
};
