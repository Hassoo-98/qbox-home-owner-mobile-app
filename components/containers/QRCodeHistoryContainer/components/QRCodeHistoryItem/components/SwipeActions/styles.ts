import { Colors, Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: mvs(Spacing.md),
  },
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "100%",
  },
  shareButton: {
    backgroundColor: "#2463EB33",
  },
  expireButton: {
    backgroundColor: Colors.lightRed,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
});
