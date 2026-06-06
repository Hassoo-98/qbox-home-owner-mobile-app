import { Text } from "@/components";
import { BorderRadius, Colors, Spacing } from "@/constants";
import { useLocale } from "@/hooks";
import { mvs } from "@/utils/metrices";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import {
    Pressable,
    Modal as RNModal,
    StyleSheet,
    View,
} from "react-native";
import { OfferClaimedModalProps } from "./props";

export const OfferClaimedModal = ({
  isOpen,
  onClose,
  promotionCode,
  discount,
  serviceProvider,
  expiryDate,
}: OfferClaimedModalProps) => {
  const { t } = useLocale();

  return (
    <RNModal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={styles.container}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={Colors.text} />
          </Pressable>

          {/* Title */}
          <Text variant="primary" bold size="lg" style={styles.title}>
            {t("offerClaimedSuccessfully")}
          </Text>
          <Text variant="secondary" size="sm" style={styles.subtitle}>
            {t("promotionActivated")}
          </Text>

          {/* Gift Icon */}
          <View style={styles.giftIconContainer}>
            <Image source={require("../../../assets/images/reward.png")} resizeMode="cover" style={styles.giftIcon} />
          </View>

          {/* Promotion Summary */}
          <Text variant="primary" bold size="md" style={styles.summaryTitle}>
            {t("promotionSummary")}
          </Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text variant="secondary" size="sm">
                {t("promoCode")}
              </Text>
              <Text variant="primary" size="sm" bold>
                {promotionCode}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text variant="secondary" size="sm">
                {t("discount")}
              </Text>
              <Text variant="primary" size="sm" bold>
                {discount}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text variant="secondary" size="sm">
                {t("serviceProvider")}
              </Text>
              <Text variant="primary" size="sm" bold>
                {serviceProvider}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text variant="secondary" size="sm">
                {t("expiryDate")}
              </Text>
              <Text variant="primary" size="sm" bold>
                {expiryDate}
              </Text>
            </View>
          </View>

          {/* Info Note */}
          <View style={styles.infoContainer}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color={Colors.secondary}
            />
            <Text variant="secondary" size="xs" style={styles.infoText}>
              {t("theDiscountWillBeAppliedAutomaticallyAtCheckout")}
            </Text>
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: mvs(Spacing.lg),
  },
  container: {
    backgroundColor: Colors.white,
    borderRadius: mvs(BorderRadius.lg),
    padding: mvs(Spacing.lg),
    width: "100%",
    maxWidth: 400,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: mvs(Spacing.md),
    right: mvs(Spacing.md),
    zIndex: 1,
    padding: mvs(Spacing.xs),
  },
  giftIcon: {
    width: mvs(150),
    height: mvs(150),
  },
  title: {
    textAlign: "center",
    marginTop: mvs(Spacing.md),
    marginBottom: mvs(Spacing.xs),
  },
  subtitle: {
    textAlign: "center",
    marginBottom: mvs(Spacing.lg),
  },
  giftIconContainer: {
    alignItems: "center",
    marginVertical: mvs(Spacing.lg),
  },
  giftIconCircle: {
    width: mvs(120),
    height: mvs(120),
    borderRadius: mvs(BorderRadius.full),
    backgroundColor: Colors.gray,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryTitle: {
    marginBottom: mvs(Spacing.md),
  },
  summaryContainer: {
    gap: mvs(Spacing.sm),
    marginBottom: mvs(Spacing.lg),
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray,
    padding: mvs(Spacing.md),
    borderRadius: mvs(BorderRadius.md),
    gap: mvs(Spacing.xs),
  },
  infoText: {
    flex: 1,
  },
});
