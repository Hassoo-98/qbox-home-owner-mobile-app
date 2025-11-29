import { AttributeView } from "@/components";
import { BorderRadius, STATUS_CARDS_DATA } from "@/constants";
import { mvs } from "@/utils/metrices";
import { StyleSheet, View } from "react-native";

export const StatusCardsGrid = () => {
  return (
    <View style={styles.container}>
      {STATUS_CARDS_DATA.map((item) => (
        <AttributeView key={item.id} item={item} />
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
