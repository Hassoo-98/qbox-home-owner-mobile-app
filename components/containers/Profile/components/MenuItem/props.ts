import { Href } from "expo-router";
import { GestureResponderEvent } from "react-native";

export interface MenuItemProps {
  title: string;
  rightText?: string;
  textColor?: string;
  backgroundColor?: string;
  path?: Href;
  onPress?: (event: GestureResponderEvent) => void;
  icon?: React.ComponentType<{ size?: number; color?: string }>;
}
