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
    color: "#FFFFFF",
  },
  secondaryText: {
    color: "#FFFFFF",
  },
  outlineText: {
    color: Colors.primary,
  },
  transparentText: {
    color: Colors.primary,
  },
  dangerText: {
    color: "#FFFFFF",
  },
  disabledText: {
    color: Colors.secondaryText,
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
