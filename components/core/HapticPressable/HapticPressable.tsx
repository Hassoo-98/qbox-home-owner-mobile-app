import { Link } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import { useData } from "./hooks";
import { HapticPressableProps } from "./props";

export const HapticPressable = ({
  hapticFeedback = "light",
  enableHaptic = true,
  onPressIn,
  href,
  children,
  ...props
}: HapticPressableProps) => {
  const { handlePressIn } = useData({
    hapticFeedback,
    enableHaptic,
    onPressIn,
  });

  return (
    <>
      {href ? (
        <Link onPressIn={handlePressIn} href={href}>
          {children as React.ReactNode}
        </Link>
      ) : (
        <Pressable onPressIn={handlePressIn} {...props}>
          {children}
        </Pressable>
      )}
    </>
  );
};

export { HapticPressableProps } from "./props";
