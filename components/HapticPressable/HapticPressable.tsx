import React from "react";
import { Pressable } from "react-native";
import { useData } from "./hooks";
import { HapticPressableProps } from "./props";

export const HapticPressable = ({
  hapticFeedback = "light",
  enableHaptic = true,
  onPressIn,
  children,
  ...props
}: HapticPressableProps) => {
  const { handlePressIn } = useData({
    hapticFeedback,
    enableHaptic,
    onPressIn,
  });

  return (
    <Pressable onPressIn={handlePressIn} {...props}>
      {children}
    </Pressable>
  );
};

export { HapticPressableProps } from "./props";
