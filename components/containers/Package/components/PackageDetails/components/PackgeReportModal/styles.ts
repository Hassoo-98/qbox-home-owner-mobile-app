import { Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(6, 10, 25, 0.28)",
  },
  sheetWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  reportModalContainer: {
    width: "100%",
    maxWidth: 460,
    maxHeight: "88%",
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.2,
    shadowRadius: 28,
    elevation: 16,
  },
  formContent: {
    paddingBottom: Spacing.sm,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: mvs(14),
  },
  headerIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    color: "#111827",
    marginHorizontal: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginBottom: Spacing.md,
  },
  readOnlyInput: {
    color: "#111827",
    backgroundColor: "#F3F4F6",
    fontWeight: "700",
  },
  dropdown: {
    backgroundColor: "#FCFCFD",
    borderColor: "#E5E7EB",
    borderRadius: 14,
  },
  descriptionInput: {
    minHeight: 140,
    textAlignVertical: "top",
  },
  sendButton: {
    marginTop: Spacing.sm,
    borderRadius: 14,
    minHeight: 48,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: mvs(8),
  },
});
