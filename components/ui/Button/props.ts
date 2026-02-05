import { HapticPressableProps } from "@/components";
import { ElementSize, ElementVariant } from "@/constants";
import { StyleProp, TextStyle, ViewStyle } from "react-native";

export interface ButtonProps extends Omit<HapticPressableProps, "children"> {
  title?: string;
  variant?: ElementVariant;
  size?: ElementSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}
