import { BorderRadius, Colors, Spacing } from "@/constants";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: "transparent",
  },

  // Sizes (using Spacing constants)
  xs: {
    paddingVertical: Spacing.xs + 2, // 6px
    paddingHorizontal: Spacing.sm + 4, // 12px
    minHeight: 32,
  },
  sm: {
    paddingVertical: Spacing.sm, // 8px
    paddingHorizontal: Spacing.md, // 16px
    minHeight: 36,
  },
  md: {
    paddingVertical: Spacing.sm + 4, // 12px
    paddingHorizontal: Spacing.lg, // 24px
    minHeight: 44,
  },
  lg: {
    paddingVertical: Spacing.md, // 16px
    paddingHorizontal: Spacing.xl, // 32px
    minHeight: 52,
  },
  xl: {
    paddingVertical: Spacing.lg - 4, // 20px
    paddingHorizontal: Spacing.xl + 8, // 40px
    minHeight: 60,
  },

  // Variants
  default: {
    backgroundColor: Colors.background,
    borderColor: Colors.secondaryText,
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.secondary,
  },
  outline: {
    backgroundColor: "transparent",
    borderColor: Colors.primary,
  },
  transparent: {
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
  danger: {
    backgroundColor: Colors.danger,
  },
  success: {
    backgroundColor: Colors.successBackground,
  },
  warning: {
    backgroundColor: Colors.warning,
  },
  disabled: {
    opacity: 0.5,
  },

  // Text base style
  text: {
    fontWeight: "600",
    textAlign: "center",
  },

  // Variant text colors
  defaultText: {
    color: Colors.text,
  },
  primaryText: {
    color: Colors.white,
  },
  secondaryText: {
    color: Colors.white,
  },
  outlineText: {
    color: Colors.primary,
  },
  transparentText: {
    color: Colors.primary,
  },
  dangerText: {
    color: Colors.white,
  },
  successText: {
    color: Colors.success,
  },
  warningText: {
    color: Colors.warningText,
  },

  // States
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },

  // Disabled variants
  defaultDisabled: {
    backgroundColor: Colors.background,
    borderColor: Colors.secondaryText,
  },
  primaryDisabled: {
    backgroundColor: Colors.secondaryText,
  },
  secondaryDisabled: {
    backgroundColor: Colors.secondaryText,
  },
  outlineDisabled: {
    borderColor: Colors.secondaryText,
  },
  transparentDisabled: {},
  dangerDisabled: {
    backgroundColor: "#FF9F9A",
  },

  // Disabled text colors for each variant
  defaultDisabledText: {
    color: Colors.secondaryText,
  },
  primaryDisabledText: {
    color: Colors.white,
  },
  secondaryDisabledText: {
    color: Colors.white,
  },
  outlineDisabledText: {
    color: Colors.secondaryText,
  },
  transparentDisabledText: {
    color: Colors.secondaryText,
  },
  dangerDisabledText: {
    color: Colors.white,
  },

  // Content container for proper centering
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  // Icon positioning (using Spacing)
  iconLeft: {
    marginRight: Spacing.sm, // 8px
  },
  iconRight: {
    marginLeft: Spacing.sm, // 8px
  },

  // Width
  fullWidth: {
    width: "100%",
  },
});
