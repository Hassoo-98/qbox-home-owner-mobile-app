import { HapticPressable } from "@/components";
import { Colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { AppHeaderLeftProps } from "./props";

export const AppHeaderLeft = ({ canGoBack }: AppHeaderLeftProps) => {
  if (!canGoBack) return null;

  return (
    <HapticPressable onPress={() => router.back()} style={{ marginLeft: 16 }}>
      <Ionicons name="arrow-back" size={24} color={Colors.dark || "#000"} />
    </HapticPressable>
  );
};
