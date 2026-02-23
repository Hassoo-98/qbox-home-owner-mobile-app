import { PackageItemIcon } from "@/assets/icons";
import { Card, Chip, Text } from "@/components";
import { BorderRadius, Colors, Spacing } from "@/constants";
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
  const handleCardPress = (id: string) => {
    router.navigate({
      pathname: "/packageDetails/[id]",
      params: { id, type: type.toLowerCase() },
    });
  };

  const renderPackageCard = ({ item }: { item: PackageListItem }) => {
    const isOutgoing = !!item.outgoing_status;

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
                {isOutgoing
                  ? item.merchant_name || item.service_provider || "Recipient Name"
                  : item.merchant_name ||
                  item.service_provider ||
                  "Courier Name"}
              </Text>

              {isOutgoing ? (
                <Chip
                  label={item.outgoing_status || ""}
                  size="small"
                  variant={
                    item.outgoing_status?.toLowerCase().includes("sent") ||
                      item.outgoing_status?.toLowerCase().includes("send")
                      ? "warning"
                      : "info"
                  }
                />
              ) : (
                <Chip
                  label={item.city || "City"}
                  size="small"
                  variant="default"
                />
              )}
            </View>

            {/* Subtitle */}
            <Text size="sm" variant="secondary" numberOfLines={1}>
              {isOutgoing
                ? item.details?.summary || "Delivery Speed"
                : item.driver_name || "Driver Name / Sender Name"}
            </Text>

            {/* Tracking ID */}
            <Text variant="secondary" size="sm" style={styles.trackingId}>
              {item.tracking_id}
            </Text>
            {/* Created Date */}
            <Text variant="secondary" size="xs">
              {item.created_at
                ? format(new Date(item.created_at), "dd/MM/yyyy hh:mm a")
                : "Date & Time"}
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
