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
    justifyContent: "space-between",
    marginBottom: Spacing.xs + 2,
  },

  labelIcon: {
    width: 20,
    height: 20,
    marginRight: Spacing.xs,
  },

  label: {
    fontSize: 14,
    flex: 1,
  },

  endAdornment: {
    flexDirection: "row",
    alignItems: "center",
  },

  dropdown: {
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.inActive,
    borderRadius: BorderRadius.md,
    minHeight: 46,
    paddingHorizontal: Spacing.md,
  },

  dropdownError: {
    borderColor: Colors.danger,
  },

  dropdownContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.inActive,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: 200,
  },

  placeholderStyle: {
    fontSize: 14,
    color: Colors.secondary,
  },

  selectedTextStyle: {
    fontSize: 14,
    color: Colors.text,
  },

  itemTextStyle: {
    fontSize: 14,
    color: Colors.text,
  },

  itemContainerStyle: {
    paddingVertical: Spacing.sm + 2,
  },

  errorText: {
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
});
