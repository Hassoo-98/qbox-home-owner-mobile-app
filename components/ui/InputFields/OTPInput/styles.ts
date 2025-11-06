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
    marginBottom: Spacing.xs + 2,
  },

  labelIcon: {
    width: 20,
    height: 20,
    marginRight: Spacing.xs,
  },

  label: {
    fontSize: 14,
  },

  otpContainer: {
    width: "100%",
    gap: Spacing.sm,
  },

  digitBox: {
    backgroundColor: "#FCFCFD",
    borderWidth: 1.5,
    borderColor: "#E6E8EC",
    borderRadius: BorderRadius.md,
    minHeight: 46,
    minWidth: 46,
  },

  digitBoxFocused: {
    borderColor: "#6B7A8F",
    borderWidth: 2,
    backgroundColor: "#FFFFFF",
  },

  digitBoxError: {
    borderColor: Colors.danger,
    borderWidth: 1.5,
  },

  digitBoxFilled: {
    borderColor: "#6B7A8F",
    backgroundColor: "#FFFFFF",
  },

  digitText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },

  focusStick: {
    backgroundColor: "#6B7A8F",
    height: 2,
    width: 20,
  },

  errorText: {
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
});
