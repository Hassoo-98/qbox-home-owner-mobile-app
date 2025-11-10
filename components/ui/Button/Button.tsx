import { HapticPressable, Text } from "@/components";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { ButtonProps } from "./props";
import { styles } from "./styles";

export const Button = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  hapticFeedback = "medium",
  enableHaptic = true,
  style,
  textStyle,
  ...restProps
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  const getTextVariant = () => {
    if (variant === "outline" || variant === "transparent") return "primary";
    if (variant === "default") return "default";
    return variant;
  };

  const getIndicatorColor = () => {
    if (variant === "outline" || variant === "transparent")
      return styles.primary.backgroundColor;
    return "#FFFFFF";
  };

  return (
    <HapticPressable
      onPress={onPress}
      disabled={isDisabled}
      hapticFeedback={hapticFeedback}
      enableHaptic={enableHaptic}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        isDisabled && styles[`${variant}Disabled` as keyof typeof styles],
        style,
      ]}
      {...restProps}
    >
      {loading ? (
        <ActivityIndicator color={getIndicatorColor()} size="small" />
      ) : (
        <View style={styles.contentContainer}>
          {icon && iconPosition === "left" && (
            <View style={styles.iconLeft}>{icon}</View>
          )}
          {title && (
            <Text
              variant={getTextVariant()}
              size={size}
              style={[
                styles.text,
                styles[`${variant}Text` as keyof typeof styles],
                isDisabled &&
                  styles[`${variant}DisabledText` as keyof typeof styles],
                textStyle,
              ]}
            >
              {title}
            </Text>
          )}
          {icon && iconPosition === "right" && (
            <View style={styles.iconRight}>{icon}</View>
          )}
        </View>
      )}
    </HapticPressable>
  );
};

export { ButtonProps } from "./props";
