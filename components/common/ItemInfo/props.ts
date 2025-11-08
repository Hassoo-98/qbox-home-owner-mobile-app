import { ViewStyle } from "react-native";

export interface ItemInfoProps {
  title: string;
  description: string;
  style?: ViewStyle;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
}
