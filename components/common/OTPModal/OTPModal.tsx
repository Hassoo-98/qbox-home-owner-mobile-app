import { Button, OTPInput, Text } from "@/components";
import { Spacing } from "@/constants";
import { useLocale } from "@/hooks";
import { BlurView } from "expo-blur";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Platform,
  Modal as RNModal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { OTPModalProps } from "./props";

export const OTPModal = ({
  isOpen,
  onClose,
  isForgotPassowrd,
  onSubmit,
  secondaryButtonHandler,
  isLoading,
  title,
  subtitle,
  footerAction,
  primaryButtonText,
  footerText,
}: OTPModalProps) => {
  const { t } = useLocale();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      otp: "",
    },
  });

  const handleOTPSubmit = async (data: any) => {
    await Promise.resolve(onSubmit(data.otp));
  };

  const resendOtp = () => {
    //resend otp logic
    console.log("Resend the otp button is pressed");
  };

  return (
    <RNModal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback >
        <BlurView
          intensity={Platform.OS === "ios" ? 30 : 80}
          tint="dark"
          style={styles.blurContainer}
        >
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.container}>
              <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
              </View>
              <OTPInput
                name="otp"
                control={control}
                numberOfDigits={6}
                rules={{
                  required: t("otpRequired"),
                  minLength: {
                    value: 6,
                    message: t("otpMustBe6Digits"),
                  },
                  maxLength: {
                    value: 6,
                    message: t("otpMustBe6Digits"),
                  },
                }}
              />

              {isForgotPassowrd && (
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: Spacing.md,
                  }}
                >
                  {t("didntReceiveTheCode")}{" "}
                  <Text
                    variant="primary"
                    style={{ fontWeight: "bold" }}
                    onPress={resendOtp}
                  >
                    {t("resendAgain")}
                  </Text>
                </Text>
              )}

              <View style={styles.actions}>
                <Button
                  title={primaryButtonText || t("verify")}
                  loading={isLoading}
                  onPress={handleSubmit(handleOTPSubmit)}
                />

                <Text
                  style={{
                    textAlign: "center",
                    marginTop: Spacing.sm,
                  }}
                >
                  {footerText}{" "}
                  <Text
                    variant="primary"
                    style={{ fontWeight: "bold" }}
                    onPress={async () => {
                      if (secondaryButtonHandler) {
                        const result = await Promise.resolve(secondaryButtonHandler());
                        if (result !== false) {
                          onClose();
                        }
                        return;
                      }

                      resendOtp();
                    }}
                  >
                    {footerAction}
                  </Text>
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </BlurView>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  blurContainer: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  container: {
    backgroundColor: "#F5F5F7",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    alignSelf: "center",
  },
  content: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
    color: "#1a1a1a",
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "400",
    textAlign: "center",
    color: "#6B6B6B",
    lineHeight: 22,
  },
  actions: {
    marginTop: 24,
  },
});
