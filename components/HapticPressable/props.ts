import { HapticFeedbackType } from "@/constants";
import { PressableProps } from "react-native";

export interface HapticPressableProps extends PressableProps {
  hapticFeedback?: HapticFeedbackType;
  enableHaptic?: boolean;
}
