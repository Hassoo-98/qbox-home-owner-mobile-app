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
  validateStep,
  onSubmit,
  contactInfo,
  handleSendOtp,
  handleVerifyOtp,
  isQBoxVerified,
}: SignupFooterProps) => {
  const { onTriggerModal, onCloseModal } = useModal();

  const handleVerify = () => {
    // Send OTP when modal triggers
    handleSendOtp(contactInfo, () => {
      onTriggerModal({
        modalType: "otp",
        title: "OTP Verification",
        subtitle: `Enter the 6-digit code sent to your email. ${contactInfo}`,
        footerText: "Didn’t receive the code?",
        footerAction: "Resend OTP",
        primaryButtonText: "Verify",
        secondaryButtonHandler: () => handleSendOtp(contactInfo),
        primaryButtonHandler: (otpValue?: any) => {
          console.log("otp verification triggered: ", otpValue);
          // The modal should pass the OTP value here
          handleVerifyOtp(contactInfo, otpValue as string, () => {
            setCurrentStep((prev) => prev + 1);
            onCloseModal?.();
          });
        },
      });
    });
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (!isValid) return;

    switch (currentStep) {
      case 1:
        handleVerify();
        break;
      case 2:
        if (isQBoxVerified) {
          setCurrentStep((prev) => prev + 1);
        }
        break;
      case 3:
        onSubmit();
        break;
    }
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
            setCurrentStep((prev) => prev - 1);
          }}
        />
        <Button
          title={currentStep === 3 ? "Complete" : "Next"}
          onPress={handleNext}
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
          alignItems: "flex-start",
        }}
      >
        <WarningIconOutline width={20} height={20} />

        <View style={{ flex: 1, flexShrink: 1 }}>
          <Text
            size="sm"
            variant="warning"
            style={{ fontWeight: "bold" }}
            numberOfLines={undefined}
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
