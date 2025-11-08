import { HapticPressable } from "@/components/core";
import { View } from "react-native";
import { CardProps } from "./props";
import { styles } from "./styles";

export const Card = ({
  children,
  onPress,
  style,
  contentStyle,
  variant = "elevated",
  backgroundColor,
  borderColor,
  borderRadius,
  showSideBorder = false,
  sideBorderColor = "#ef4444",
  sideBorderWidth = 4,
}: CardProps) => {
  const cardStyles = [
    styles.card,
    variant === "elevated" && styles.elevated,
    variant === "outlined" &&
      (borderColor ? { borderWidth: 1, borderColor } : styles.outlined),
    variant === "filled" && styles.filled,
    backgroundColor && { backgroundColor },
    borderColor && variant !== "outlined" && { borderColor },
    borderRadius !== undefined && { borderRadius },
    showSideBorder && {
      borderLeftWidth: sideBorderWidth,
      borderLeftColor: sideBorderColor,
    },
    style,
  ];

  const CardWrapper = onPress ? HapticPressable : View;

  return (
    <CardWrapper style={cardStyles} onPress={onPress}>
      <View style={[styles.content, contentStyle]}>{children}</View>
    </CardWrapper>
  );
};

export default Card;
