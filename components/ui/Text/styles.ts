import { Colors } from "@/constants";
import { mvs } from "@/utils/metrices";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // Base style
  base: {
    color: Colors.text,
  },

  // Size variants
  xs: {
    fontSize: mvs(12),
    lineHeight: mvs(16),
  },
  sm: {
    fontSize: mvs(14),
    lineHeight: mvs(20),
  },
  md: {
    fontSize: mvs(16),
    lineHeight: mvs(24),
  },
  lg: {
    fontSize: mvs(18),
    lineHeight: mvs(28),
  },
  xl: {
    fontSize: mvs(20),
    lineHeight: mvs(32),
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
