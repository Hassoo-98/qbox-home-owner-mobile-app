import { Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    padding: Spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  reportModalContainer: {
    backgroundColor: "#F5F5F7",
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 15,
    width: "95%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: mvs(12),
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: mvs(8),
  },
});
