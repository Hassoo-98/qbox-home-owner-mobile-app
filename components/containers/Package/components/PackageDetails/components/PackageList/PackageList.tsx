import { PackageItemIcon } from "@/assets/icons";
import { Card, Chip, Text } from "@/components";
import { BorderRadius, Colors, PACKAGE_TYPE, Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import { format } from "date-fns";
import { router } from "expo-router";
import { FlatList, StyleSheet, View } from "react-native";

interface Package {
  id: number;
  title: string;
  Subtitle: string;
  trackingId: string;
  createdAt: string;
  type: string;
  city?: string | null;
  status?: string | null;
}

interface PackageListProps {
  packages: Package[];
}

export const PackageList = ({ packages }: PackageListProps) => {
  const handleCardPress = (id: number) => {
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
            <Text style={styles.title}>{item.title}</Text>

            {item.type === PACKAGE_TYPE.INCOMING && item.city && (
              <Chip label={item.city} size="medium" />
            )}

            {item.type === PACKAGE_TYPE.OUTGOING && item.status && (
              <Chip
                label={item.status}
                size="medium"
                variant={
                  item.status === "Send"
                    ? "warning"
                    : item.status === "Return"
                    ? "info"
                    : "default"
                }
              />
            )}
          </View>

          {/* Subtitle */}
          <Text size="sm">{item.Subtitle}</Text>

          {/* Tracking ID */}
          <Text variant="secondary" size="sm" style={styles.trackingId}>
            {item.trackingId}
          </Text>

          {/* Created Date */}
          <Text variant="secondary" size="sm">
            {format(new Date(item.createdAt), "Pp")}
          </Text>
        </View>
      </View>
    </Card>
  );

  return (
    <FlatList
      data={packages}
      keyExtractor={(item) => item.id.toString()}
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
