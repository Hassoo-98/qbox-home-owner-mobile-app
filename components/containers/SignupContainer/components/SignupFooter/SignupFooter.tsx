import { WarningIconOutline } from "@/assets/icons";
import { Button, Text } from "@/components/ui";
import { Colors, Spacing } from "@/constants";
import { useModal } from "@/hooks";
import { mvs } from "@/utils/metrices";
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
  const { onTriggerModal } = useModal();

  const handleVerify = () => {
    onTriggerModal({
      modalType: "otp",
      title: "OTP Verification",
      subtitle: `Enter the 5-digit code sent to your phone number. ${phoneNumber}`,
      footerText: "Didn’t receive the code?",
      footerAction: "Resend OTP",
      secondaryButtonHandler: () => console.log("Resend OTP"),
      primaryButtonHandler: () => {
        console.log("otp verified: ", currentStep);
        setCurrentStep((prev) => ++prev);
      },
    });
  };

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
          }}
        />
        <Button
          title="Next"
          disabled={!isFormValid}
          onPress={() => {
            console.log("current step: ", currentStep);
            switch (currentStep) {
              case 1:
                handleVerify();
                return;
              case 2:
                setCurrentStep((prev) => ++prev);
                return;
              case 3:
                onSubmit();
                return;
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
          alignItems: "flex-start", // Important: align to top, not center
        }}
      >
        <WarningIconOutline width={20} height={20} />

        {/* Wrap text content in a flexible container */}
        <View style={{ flex: 1, flexShrink: 1 }}>
          <Text
            size="sm"
            variant="warning"
            style={{ fontWeight: "bold" }}
            numberOfLines={undefined} // Allow unlimited lines
          >
            Your data is secure
          </Text>
          <Text size="sm" variant="warning" numberOfLines={undefined}>
            All information is encrypted and stored securely. We comply with all
            data protection regulations.
          </Text>
        </View>
      </View>
    </View>
  );
};
