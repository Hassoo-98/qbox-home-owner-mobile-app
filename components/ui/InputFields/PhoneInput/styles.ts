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

  phoneInputWrapper: {
    width: "100%",
    backgroundColor: "#FCFCFD",
    borderWidth: 1.5,
    borderColor: "#E6E8EC",
    borderRadius: BorderRadius.md,
    flexDirection: "row",
    alignItems: "center",
    height: 46,
    paddingRight: Spacing.xs,
  },

  phoneInputContainer: {
    backgroundColor: "transparent",
    borderWidth: 0,
    borderRadius: BorderRadius.md,
    flex: 1,
    height: 46,
    paddingLeft: 0,
  },

  phoneInputContainerError: {
    borderColor: Colors.danger,
  },

  phoneInputTextContainer: {
    backgroundColor: "transparent",
    borderRadius: BorderRadius.md,
    paddingVertical: 0,
    paddingLeft: Spacing.sm,
  },

  phoneInputText: {
    fontSize: 14,
    color: Colors.text,
    height: 44,
    paddingLeft: 0,
  },

  phoneInputCodeText: {
    fontSize: 14,
    color: Colors.text,
  },

  phoneInputCountryPickerButton: {
    backgroundColor: "transparent",
    borderTopLeftRadius: BorderRadius.md,
    borderBottomLeftRadius: BorderRadius.md,
    paddingLeft: Spacing.sm,
  },

  endButton: {
    marginLeft: Spacing.xs,
  },

  errorText: {
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
});