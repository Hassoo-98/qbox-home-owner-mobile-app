import { GestureResponderEvent, StyleProp, ViewStyle } from "react-native";

export interface CardProps {
  children: React.ReactNode;
  onPress?: ((event: GestureResponderEvent) => void) | null;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  variant?: "elevated" | "outlined" | "filled";
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: number;
  showSideBorder?: boolean;
  sideBorderColor?: string;
  sideBorderWidth?: number;
}
