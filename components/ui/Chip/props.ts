import { StyleProp, TextStyle, ViewStyle } from "react-native";

export type ChipVariant = "default" | "warning" | "info" | "success" | "error";
export type ChipSize = "small" | "medium" | "large";

export interface ChipProps {
  label: string;

  variant?: ChipVariant;

  backgroundColor?: string;

  textColor?: string;

  size?: ChipSize;

  borderRadius?: number;

  style?: StyleProp<ViewStyle>;

  textStyle?: StyleProp<TextStyle>;

  onPress?: () => void;
}

export interface ChipVariantConfig {
  backgroundColor: string;
  textColor: string;
}

export interface ChipSizeConfig {
  paddingVertical: number;
  paddingHorizontal: number;
  fontSize: number;
  borderRadius: number;
}
