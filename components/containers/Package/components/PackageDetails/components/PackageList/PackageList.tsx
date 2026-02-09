import { PackageItemIcon } from "@/assets/icons";
import { Card, Chip, Text } from "@/components";
import { BorderRadius, Colors, PACKAGE_TYPE, Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import { format } from "date-fns";
import { router } from "expo-router";
import { FlatList, StyleSheet, View } from "react-native";

interface Package {
  id: string;
  tracking_id: string;
  merchant_name: string;
  service_provider: string;
  package_status: string;
  created_at: string;
  details: {
    summary: string;
  } | null;
}

interface PackageListProps {
  packages: Package[];
}

export const PackageList = ({ packages }: PackageListProps) => {
  const handleCardPress = (id: string) => {
    router.navigate(`/packageDetails/${id}`);
  };

  const renderPackageCard = ({ item }: { item: Package }) => (
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
            <Text style={styles.title}>{item.merchant_name || item.service_provider || "Unknown Merchant"}</Text>

            {item.package_status.toLowerCase() === PACKAGE_TYPE.INCOMING.toLowerCase() && (
              <Chip label={item.package_status} size="medium" />
            )}

            {item.package_status.toLowerCase() === PACKAGE_TYPE.OUTGOING.toLowerCase() && (
              <Chip
                label={item.package_status}
                size="medium"
                variant="info"
              />
            )}
          </View>

          {/* Subtitle */}
          <Text size="sm">{item.details?.summary || "No details available"}</Text>

          {/* Tracking ID */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text variant="secondary" size="sm" style={styles.trackingId}>
              {item.tracking_id}
            </Text>
            {/* Created Date */}
            <Text variant="secondary" size="xs">
              {format(new Date(item.created_at), "Pp")}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <FlatList
      data={packages}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      renderItem={renderPackageCard}
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
  packageInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "bold",
  },
  trackingId: {
    marginTop: mvs(Spacing.sm),
  },
});
