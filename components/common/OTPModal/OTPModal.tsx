import { Button, OTPInput, Text } from "@/components";
import { Spacing } from "@/constants";
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
  const { control, handleSubmit } = useForm({
    defaultValues: {
      otp: "",
    },
  });

  const handleOTPSubmit = () => {
    onSubmit();
    onClose();
  };

  return (
    <RNModal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
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
                numberOfDigits={5}
                rules={{
                  required: "OTP is required",
                }}
              />

              {isForgotPassowrd && (
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: Spacing.md,
                  }}
                >
                  Didn't receive code?{" "}
                  <Text
                    variant="primary"
                    style={{ fontWeight: "bold" }}
                    onPress={secondaryButtonHandler}
                  >
                    Resend again
                  </Text>
                </Text>
              )}

              <View style={styles.actions}>
                <Button
                  title={primaryButtonText || "Verify"}
                  loading={isLoading}
                  onPress={handleSubmit(handleOTPSubmit)}
                />

                <Text
                  style={{
                    textAlign: "center",
                    marginTop: Spacing.sm,
                  }}
                >
                  {footerText}
                  <Text
                    variant="primary"
                    style={{ fontWeight: "bold" }}
                    onPress={secondaryButtonHandler}
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
  },
  container: {
    backgroundColor: "#F5F5F7",
    borderRadius: 16,
    padding: 32,
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
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
