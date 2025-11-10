import { Colors } from "@/constants";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // Base style
  base: {
    color: Colors.text,
  },

  // Size variants
  xs: {
    fontSize: 12,
    lineHeight: 16,
  },
  sm: {
    fontSize: 14,
    lineHeight: 20,
  },
  md: {
    fontSize: 16,
    lineHeight: 24,
  },
  lg: {
    fontSize: 18,
    lineHeight: 28,
  },
  xl: {
    fontSize: 20,
    lineHeight: 32,
  },

  // Variant styles
  default: {
    color: Colors.text,
  },
  primary: {
    color: Colors.primary,
  },
  secondary: {
    color: Colors.secondary,
  },
  danger: {
    color: Colors.danger,
  },
  success: {
    color: Colors.success,
  },
  warning: {
    color: Colors.warningText,
  },
  transparent: {
    color: "transparent",
  },
  outline: {
    color: Colors.text,
    textDecorationLine: "underline",
  },
});
