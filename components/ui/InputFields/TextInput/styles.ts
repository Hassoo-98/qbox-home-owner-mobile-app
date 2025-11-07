import { BorderRadius, Colors, Spacing } from "@/constants";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: Spacing.md,
  },

  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs + 2, // 6px (matches mb={0.9} in MUI)
  },

  labelIcon: {
    width: 20,
    height: 20,
    marginRight: Spacing.xs,
  },

  label: {
    fontSize: 14,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FCFCFD",
    borderWidth: 1.5,
    paddingRight: Spacing.xs,
    borderColor: "#E6E8EC",
    borderRadius: BorderRadius.md,
    minHeight: 46,
  },

  inputError: {
    borderColor: Colors.danger,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    paddingHorizontal: Spacing.md,
  },

  inputWithStartIcon: {
    marginLeft: Spacing.xs,
  },

  inputWithEndIcon: {
    marginRight: Spacing.xs,
  },

  iconButton: {
    padding: Spacing.xs,
    justifyContent: "center",
    alignItems: "center",
  },

  inputIcon: {
    width: 24,
    height: 24,
  },

  endButton: {
    backgroundColor: "#6B7A8F",
    // paddingHorizontal: Spacing.lg,
    // maxHeight: 40,
    // paddingVertical: Spacing.sm + 2, // 10px
    // borderRadius: BorderRadius.sm,
    marginLeft: Spacing.sm,
    marginRight: Spacing.sm,
  },

  endButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  errorText: {
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
});
