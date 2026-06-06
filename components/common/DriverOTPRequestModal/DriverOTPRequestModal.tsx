import { Button, Text, TextInput } from "@/components";
import { BorderRadius, Colors, Spacing } from "@/constants";
import { useLocale } from "@/hooks";
import { mvs } from "@/utils/metrices";
import { BlurView } from "expo-blur";
import React from "react";
import { useForm } from "react-hook-form";
import { Platform, Modal as RNModal, StyleSheet, View } from "react-native";

export const DriverOTPRequestModal = ({ isOpen, onClose, onSubmit }: any) => {
  const { t } = useLocale();
  const { control } = useForm();

  return (
    <RNModal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <BlurView intensity={Platform.OS === "ios" ? 30 : 80} tint="dark" style={styles.blurContainer}>
        <View style={styles.container}>
          <View style={styles.modalHeader}>
            <Text style={{ fontWeight: "700" }} variant="default">
              {t("otpVerification")}
            </Text>
          </View>
          <Text size="sm" style={{ marginBottom: mvs(8) }}>
            {t("driverOtpRequest")}
          </Text>
          <TextInput
            name="trackingID"
            inputMode="numeric"
            control={control}
            autoCorrect={false}
            label={t("trackingId")}
            placeholder="XXXXXXXXXXXXXXXX"
          />

          <TextInput
            name="driverName"
            inputMode="text"
            control={control}
            autoCorrect={false}
            label={t("driverName")}
            placeholder="Ahamad"
          />

          <TextInput
            name="otp"
            inputMode="numeric"
            control={control}
            autoCorrect={false}
            label={t("otp")}
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
              title={t("cancel")}
              style={{ width: "48%", backgroundColor: Colors.white }}
              textStyle={{ color: Colors.text }}
              onPress={onClose}
            />
            <Button size="sm" title={t("assignOtp")} style={{ width: "48%" }} onPress={onSubmit} />
          </View>
          <View
            style={{
              backgroundColor: Colors.warning,
              paddingVertical: Spacing.sm,
              paddingHorizontal: Spacing.md,
              borderRadius: BorderRadius.sm,
              flexDirection: "row",
              gap: Spacing.sm,
              alignItems: "flex-start",
              marginTop: mvs(10),
            }}
          >
            <View style={{ flex: 1, flexShrink: 1 }}>
              <Text size="sm" variant="warning" style={{ fontWeight: "bold" }}>
                {t("note")}
              </Text>
              <Text size="sm" variant="warning">
                {t("driverOtpCancelNote")}
              </Text>
            </View>
          </View>
        </View>
      </BlurView>
    </RNModal>
  );
};

const styles = StyleSheet.create({
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
});
