import { HapticFeedbackType } from "@/constants";
import { Href } from "expo-router";
import { PressableProps } from "react-native";

export interface HapticPressableProps extends PressableProps {
  hapticFeedback?: HapticFeedbackType;
  enableHaptic?: boolean;
  href?: Href;
  children: React.ReactNode | PressableProps["children"];
}
