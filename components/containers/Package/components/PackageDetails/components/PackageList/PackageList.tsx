import { PackageItemIcon } from "@/assets/icons";
import { Card, Chip, Text } from "@/components";
import { BorderRadius, Colors, Spacing } from "@/constants";
import { useLocale } from "@/hooks";
import { PackageListItem } from "@/services/api/types";
import { mvs } from "@/utils/metrices";
import { format } from "date-fns";
import { router } from "expo-router";
import { FlatList, StyleSheet, View } from "react-native";

interface PackageListProps {
  packages: PackageListItem[];
  type: string;
}

export const PackageList = ({ packages, type }: PackageListProps) => {
  const { t } = useLocale();
  const isOutgoingTab = type.toLowerCase() === "outgoing";

  const handleCardPress = (id: string) => {
    router.navigate({
      pathname: "/packageDetails/[id]",
      params: { id, type: type.toLowerCase() },
    });
  };

  const renderPackageCard = ({ item }: { item: PackageListItem }) => {
    const isOutgoing = isOutgoingTab;
    const trackingId = item.trackingId || item.tracking_id || "";
    const formattedCreatedAt = item.created_at
      ? format(new Date(item.created_at), "dd/MM/yyyy hh:mm a")
      : t("dateTime");
    const incomingTitle = item.service_provider_name || item.service_provider || t("serviceProvider");
    const incomingSubtitle = item.driver_name || t("driverName");
    const outgoingTitle = item.receiver_home_owner_name || t("receiverName");
    const outgoingSubtitle = item.service_provider_name || item.service_provider || t("serviceProvider");
    const incomingChipLabel = item.sender_home_owner_city || item.city || t("city");
    const outgoingChipLabel = item.outgoing_status || item.shipment_status || "";

    return (
      <Card
        variant="filled"
        style={styles.packageCard}
        onPress={() => handleCardPress(item.id)}
      >
        <View style={styles.cardContent}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <PackageItemIcon />
          </View>
          {/* Content */}
          <View style={styles.packageInfo}>
            {/* Title + Chip */}
            <View style={styles.titleRow}>
              <Text style={styles.title} numberOfLines={1}>
                {isOutgoing ? outgoingTitle : incomingTitle}
              </Text>

              {isOutgoing ? (
                <Chip
                  label={outgoingChipLabel}
                  size="small"
                  variant={
                    item.outgoing_status?.toLowerCase().includes("sent") ||
                    item.outgoing_status?.toLowerCase().includes("send")
                      ? "warning"
                      : "info"
                  }
                />
              ) : (
                <Chip label={incomingChipLabel} size="small" variant="default" />
              )}
            </View>

            {/* Subtitle */}
            <Text size="sm" variant="secondary" numberOfLines={1}>
              {isOutgoing ? outgoingSubtitle : incomingSubtitle}
            </Text>

            {/* Tracking ID */}
            <Text variant="secondary" size="sm" style={styles.trackingId}>
              {trackingId}
            </Text>
            {/* Created Date */}
            <Text variant="secondary" size="xs">
              {formattedCreatedAt}
            </Text>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <FlatList
      data={packages}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      renderItem={renderPackageCard}
      contentContainerStyle={{ paddingBottom: mvs(100) }}
    />
  );
};

const styles = StyleSheet.create({
  packageCard: {
    marginBottom: mvs(Spacing.sm),
    width: "100%",
  },
  cardContent: {
    flexDirection: "row",
    gap: mvs(12),
  },
  iconContainer: {
    width: mvs(40),
    height: mvs(40),
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
  },
  iconOutgoing: {
    backgroundColor: Colors.darkGray,
  },
  packageInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    flex: 1,
    marginRight: 8,
  },
  trackingId: {
    marginTop: mvs(Spacing.xs),
  },
});
