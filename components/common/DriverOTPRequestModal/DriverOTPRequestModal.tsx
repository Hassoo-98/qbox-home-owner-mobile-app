import { Button, Text, TextInput } from "@/components";
import { BorderRadius, Colors, Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import { BlurView } from "expo-blur";
import React from "react";
import { useForm } from "react-hook-form";
import { Platform, Modal as RNModal, StyleSheet, View } from "react-native";

export const DriverOTPRequestModal = ({ isOpen, onClose, onSubmit }: any) => {
  const { control, handleSubmit } = useForm();

  return (
    <RNModal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView
        intensity={Platform.OS === "ios" ? 30 : 80}
        tint="dark"
        style={styles.blurContainer}
      >
        <View style={styles.container}>
          <View style={styles.modalHeader}>
            <Text style={{ fontWeight: "700" }} variant="default">
              OTP Request
            </Text>
          </View>
          <Text size="sm" style={{ marginBottom: mvs(8) }}>
            Driver "Ahmed Zaib" is requesting for the OTP.
          </Text>
          <TextInput
            name="trackingID"
            inputMode="numeric"
            control={control}
            autoCorrect={false}
            label="Tracking Id"
            placeholder="XXXXXXXXXXXXXXXX"
          />

          <TextInput
            name="driverName"
            inputMode="text"
            control={control}
            autoCorrect={false}
            label="Driver Name"
            placeholder="Ahamad"
          />

          <TextInput
            name="otp"
            inputMode="numeric"
            control={control}
            autoCorrect={false}
            label="OTP"
            placeholder="XXXXX"
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              gap: Spacing.md,
            }}
          >
            <Button
              title="Cancel"
              style={{ width: "48%", backgroundColor: Colors.white }}
              textStyle={{ color: Colors.text }}
              onPress={onClose}
            />
            <Button size="sm" title="Assign OTP" style={{ width: "48%" }} />
          </View>
          <View
            style={{
              backgroundColor: Colors.warning,
              paddingVertical: Spacing.sm,
              paddingHorizontal: Spacing.md,
              borderRadius: BorderRadius.sm,
              flexDirection: "row",
              gap: Spacing.sm,
              alignItems: "flex-start", // Important: align to top, not center
              marginTop: mvs(10),
            }}
          >
            {/* Wrap text content in a flexible container */}
            <View style={{ flex: 1, flexShrink: 1 }}>
              <Text size="sm" variant="warning" style={{ fontWeight: "bold" }}>
                Note:
              </Text>
              <Text size="sm" variant="warning">
                By clicking on the Cancel button, your delivery will be marked
                as failed.
              </Text>
            </View>
          </View>
        </View>
      </BlurView>
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
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: mvs(8),
  },
  closeButton: {
    padding: mvs(4),
  },
  closeButtonText: {
    fontSize: 20,
    color: Colors.secondaryText,
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
