import { Card, Text } from "@/components";
import { BorderRadius } from "@/constants";
import { mvs } from "@/utils/metrices";
import { StyleSheet, View } from "react-native";

export const AttributeView = ({ item, width = "48%", style }: any) => {
  console.log("item", JSON.stringify(item, null, 4));
  const Icon = item.icon;
  return (
    <Card variant="filled" style={[styles.card, { width }, style]}>
      <Icon />
      <Text variant="primary" size="xs" numberOfLines={1}>
        {item.title}
      </Text>

      <View style={styles.statusContainer}>
        {item.statusColor && (
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: item.statusColor },
            ]}
          />
        )}
        <Text size="xs" style={styles.statusText} numberOfLines={1}>
          {item.statusText}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {},
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: mvs(5),
  },
  statusIndicator: {
    width: mvs(13),
    height: mvs(13),
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontWeight: "bold",
  },
});
