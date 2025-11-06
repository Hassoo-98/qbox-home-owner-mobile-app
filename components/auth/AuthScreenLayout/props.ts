import { ReactNode } from "react";
import { ViewStyle } from "react-native";

export interface AuthScreenLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  headerContent?: ReactNode;
  style?: ViewStyle;
}
