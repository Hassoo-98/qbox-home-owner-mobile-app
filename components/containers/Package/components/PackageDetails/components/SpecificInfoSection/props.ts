import { ViewStyle } from "react-native";

export interface InfoSectionProps {
  title?: string;
  description?: string;
  value: string | number;
  containerStyle?: ViewStyle;
}
