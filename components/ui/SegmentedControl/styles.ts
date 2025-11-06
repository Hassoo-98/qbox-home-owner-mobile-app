import { BorderRadius, Colors, Spacing } from "@/constants";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#C2C1CD33",
    borderRadius: BorderRadius.md,
    padding: 4,
    marginBottom: Spacing.md,
  },
  segmentContainer: {
    flexDirection: "row",
    position: "relative",
  },
  activeIndicator: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    top: 2,
    height: "90%",
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1, // Keep text above the animated background
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  inactiveTabText: {
    color: Colors.text,
  },
});
