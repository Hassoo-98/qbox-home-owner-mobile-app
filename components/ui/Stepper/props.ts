import { ViewStyle } from "react-native";

export interface StepperProps {
  totalSteps: number;
  currentStep: number;
  activeColor?: string;
  inactiveColor?: string;
  height?: number;
  style?: ViewStyle;
  spacing?: number;
}
