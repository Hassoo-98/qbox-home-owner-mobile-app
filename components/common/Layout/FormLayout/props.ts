import { ReactNode } from "react";
import { ViewStyle } from "react-native";

export interface FormLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  currentStep?: number;
  totalSteps?: number;
  headerContent?: ReactNode;
  style?: ViewStyle;
  stepperStyle?: ViewStyle;
  footer?: React.ReactNode;
}
