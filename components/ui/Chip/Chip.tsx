import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ChipProps } from "./props";
import { chipSizes, chipVariants, styles } from "./styles";

export const Chip = ({
  label,
  variant = "default",
  backgroundColor,
  textColor,
  size = "medium",
  style,
  textStyle,
  onPress,
  borderRadius,
}: ChipProps) => {
  const selectedVariant = chipVariants[variant] || chipVariants.default;
  const selectedSize = chipSizes[size];

  const chipStyles = [
    styles.chip,
    {
      backgroundColor: backgroundColor || selectedVariant.backgroundColor,
      paddingVertical: selectedSize.paddingVertical,
      paddingHorizontal: selectedSize.paddingHorizontal,
      borderRadius:
        borderRadius !== undefined ? borderRadius : selectedSize.borderRadius,
    },
    style,
  ];

  const chipTextStyles = [
    styles.text,
    {
      color: textColor || selectedVariant.textColor,
      fontSize: selectedSize.fontSize,
    },
    textStyle,
  ];

  const ChipWrapper = onPress ? TouchableOpacity : View;

  return (
    <ChipWrapper
      style={chipStyles}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Text style={chipTextStyles}>{label}</Text>
    </ChipWrapper>
  );
};

export default Chip;
