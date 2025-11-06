import { HapticFeedbackType } from "@/constants";
import * as Haptics from "expo-haptics";
import { GestureResponderEvent } from "react-native";

export const useData = ({
  hapticFeedback,
  enableHaptic,
  onPressIn,
}: {
  hapticFeedback?: HapticFeedbackType;
  enableHaptic?: boolean;
  onPressIn?: ((event: GestureResponderEvent) => void) | null;
}) => {
  const triggerHaptic = () => {
    if (!enableHaptic || process.env.EXPO_OS !== "ios") return;

    switch (hapticFeedback) {
      case "light":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case "medium":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case "heavy":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case "selection":
        Haptics.selectionAsync();
        break;
      case "success":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case "warning":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case "error":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
    }
  };

  const handlePressIn = (event: any) => {
    triggerHaptic();
    onPressIn?.(event);
  };

  return { handlePressIn };
};
