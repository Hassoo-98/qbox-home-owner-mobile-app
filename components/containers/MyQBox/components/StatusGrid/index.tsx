import { Card, Text } from "@/components";
import { BorderRadius, STATUS_CARDS_DATA } from "@/constants";
import { mvs } from "@/utils/metrices";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

export const StatusCardsGrid = () => {
  return (
    <View style={styles.container}>
      {STATUS_CARDS_DATA.map((item) => (
        <Card key={item.id} variant="filled" style={styles.card}>
          <MaterialIcons name={item.icon as any} size={20} />
          <Text variant="primary">{item.title}</Text>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusIndicator,
                { backgroundColor: item.statusColor },
              ]}
            />
            <Text style={styles.statusText}>{item.statusText}</Text>
          </View>
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "90%",
    gap: mvs(12),
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
  },
  statusContainer: {
    flexDirection: "row",
    gap: mvs(5),
    alignItems: "center",
  },
  statusIndicator: {
    width: mvs(20),
    height: mvs(20),
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontWeight: "bold",
  },
});
