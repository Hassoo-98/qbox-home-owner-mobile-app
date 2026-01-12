import { Text } from "@/components/ui";
import { Colors } from "@/constants";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { RadioButtonProps } from "./props";

export const RadioButton = ({
  title,
  subtitle,
  selected,
  onPress,
}: RadioButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
      }}
    >
      {/* Radio Button */}
      <View
        style={{
          height: 22,
          width: 22,
          borderRadius: 11,
          borderWidth: 2,
          borderColor: Colors.text,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        {selected && (
          <View
            style={{
              height: 12,
              width: 12,
              backgroundColor: Colors.text,
              borderRadius: 6,
            }}
          />
        )}
      </View>

      {/* Labels */}
      <View>
        <Text size="sm" variant="default" style={{ fontWeight: "bold" }}>
          {title}
        </Text>
        <Text size="sm" variant="secondary">
          {subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
