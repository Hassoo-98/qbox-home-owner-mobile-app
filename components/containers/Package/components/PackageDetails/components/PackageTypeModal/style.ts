import { Colors, Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  blurContainer: {
    flex: 1,
    padding: Spacing.sm,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  modalContent: {
    backgroundColor: "#F5F5F7",
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 15,
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: mvs(8),
  },
  modalTitle: {
    fontWeight: "700",
  },
  closeButton: {
    padding: mvs(4),
  },
  description: {
    marginBottom: mvs(24),
  },
  optionsContainer: {
    flexDirection: "row",
    gap: mvs(16),
    marginBottom: mvs(24),
  },
  optionCard: {
    width: "48%",
  },
  optionCardSelected: {
    backgroundColor: Colors.primary,
  },
  optionIconContainer: {
    alignSelf: "center",
  },
  optionLabel: {
    fontWeight: "500",
    textAlign: "center",
  },
});
