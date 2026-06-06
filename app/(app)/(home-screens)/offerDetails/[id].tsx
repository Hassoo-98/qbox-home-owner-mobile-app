import { Button, OfferClaimedModal, Text } from "@/components";
import { BorderRadius, Colors, Spacing } from "@/constants";
import { usePromotionDetail } from "@/hooks/api/useHomeQueries";
import { useLocale } from "@/hooks";
import { mvs } from "@/utils/metrices";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export const OfferDetails = () => {
  const { t } = useLocale();
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { data: promotionResponse, isLoading, error } = usePromotionDetail(id);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const promotion = promotionResponse?.data;

  useLayoutEffect(() => {
    if (promotion) {
      navigation.setOptions({
        title: promotion.title,
      });
    }
  }, [promotion, navigation]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error || !promotion) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Offer not found</Text>
      </View>
    );
  }

  // Dynamic data from API
  const promotionCode = promotion.code;
  const promotionType = promotion.promo_type;
  const discount = `${promotion.value} SAR`;
  const serviceProvider = promotion.merchant_provider_name;
  const startDate = promotion.start_date;
  const endDate = promotion.end_date;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
          {/* Promotion Title */}
          <View style={styles.section}>
            <Text variant="primary" bold size="lg" style={styles.sectionTitle}>
              {t("promotionTitle")}
            </Text>
            <Text variant="secondary" size="sm">
              {promotion.subtitle}
            </Text>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text variant="primary" bold size="lg" style={styles.sectionTitle}>
              {t("description")}
            </Text>
            <Text variant="secondary" size="sm" style={styles.descriptionText}>
              {promotion.description}
            </Text>
          </View>

          {/* Promotion Code */}
          <View style={styles.section}>
            <Text variant="primary" bold size="lg" style={styles.sectionTitle}>
              {t("promotionCode")}
            </Text>
            <View style={styles.codeContainer}>
              <Text variant="secondary" size="xs" style={styles.codeLabel}>
                Code
              </Text>
              <Text variant="primary" size="md">
                {promotionCode}
              </Text>
            </View>
          </View>

          {/* Promotion Summary */}
          <View style={styles.section}>
            <Text variant="primary" bold size="lg" style={styles.sectionTitle}>
              {t("promotionSummary")}
            </Text>
            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text variant="secondary" size="sm">
                  Promotion Type
                </Text>
                <Text variant="primary" size="sm" bold>
                  {promotionType}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text variant="secondary" size="sm">
                  Discount
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
                  {t("startDate")}
                </Text>
                <Text variant="primary" size="sm" bold>
                  {startDate}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text variant="secondary" size="sm">
                  {t("endDate")}
                </Text>
                <Text variant="primary" size="sm" bold>
                  {endDate}
                </Text>
              </View>
            </View>
          </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.buttonContainer}>
        <Button
          title={t("claimOffer")}
          fullWidth
          onPress={() => setShowSuccessModal(true)}
        />
      </View>

      {/* Success Modal */}
      <OfferClaimedModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        promotionCode={promotionCode}
        discount={discount}
        serviceProvider={serviceProvider}
        expiryDate={endDate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: mvs(Spacing.lg),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  card: {
    padding: mvs(Spacing.lg),
  },
  section: {
    marginBottom: mvs(Spacing.lg),
  },
  sectionTitle: {
    marginBottom: mvs(Spacing.sm),
  },
  descriptionText: {
    lineHeight: mvs(20),
  },
  codeContainer: {
    backgroundColor: Colors.gray,
    padding: mvs(Spacing.md),
    borderRadius: mvs(BorderRadius.md),
  },
  codeLabel: {
    marginBottom: mvs(4),
  },
  summaryContainer: {
    gap: mvs(Spacing.md),
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonContainer: {
    padding: mvs(Spacing.lg),
    paddingBottom: mvs(Spacing.xl),
    backgroundColor: Colors.background,
  },
});

export default OfferDetails;
