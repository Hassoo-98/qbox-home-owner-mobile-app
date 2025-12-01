/**
 * Below are the colors that are used in the app.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const primaryColor = "#28475C";
const secondaryColor = "#777E90";

export const Colors = {
  text: "#1C1E24",
  secondaryText: secondaryColor,
  transparent: "transparent",
  background: "#FCFCFD",
  gray: "#F4F5F6",
  border: "#E5E7EB",
  border2: "#D6D8E0",
  dark: "#1C1E24",
  darkGray: "#28475C1A",
  inActive: "#E6E8EC",
  white: "#fff",
  danger: "#c70000",
  successDark: "#103923",
  warning: "#FCEAC8",
  lightRed: "#F9DADB",
  success: "#2FA766",
  successBackground: "#C5EFD8",
  warningText: "#7B5D24",
  primary: primaryColor,
  secondary: secondaryColor,
  icon: secondaryColor,
  tabIconDefault: secondaryColor,
  tabIconSelected: primaryColor,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const IconSize = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
} as const;

export type HapticFeedbackType =
  | "light"
  | "medium"
  | "heavy"
  | "selection"
  | "success"
  | "warning"
  | "error";

export type ElementSize = "xs" | "sm" | "md" | "lg" | "xl";

// FIXED: Removed "disabled" - it's a state prop, not a variant
export type ElementVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "transparent"
  | "outline"
  | "warning"
  | "default";

export type FontVariants = "sans" | "serif" | "rounded" | "mono" | "default";

type FontMapping = Record<FontVariants, string>;

export const Fonts: FontMapping = Platform.select<FontMapping>({
  ios: {
    default: "system-ui",
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  android: {
    default: "normal",
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    default:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
  default: {
    default: "normal",
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
})!;
