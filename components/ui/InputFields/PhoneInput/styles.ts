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
  },

  phoneInputContainer: {
    backgroundColor: "#FCFCFD",
    borderWidth: 1.5,
    borderColor: "#E6E8EC",
    borderRadius: BorderRadius.md,
    width: "100%",
    height: 46,
  },

  phoneInputContainerError: {
    borderColor: Colors.danger,
  },

  phoneInputTextContainer: {
    backgroundColor: "#FCFCFD",
    borderRadius: BorderRadius.md,
    paddingVertical: 0,
  },

  phoneInputText: {
    fontSize: 14,
    color: Colors.text,
    height: 44,
  },

  phoneInputCodeText: {
    fontSize: 14,
    color: Colors.text,
  },

  phoneInputCountryPickerButton: {
    backgroundColor: "#FCFCFD",
    borderTopLeftRadius: BorderRadius.md,
    borderBottomLeftRadius: BorderRadius.md,
  },

  errorText: {
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
});
