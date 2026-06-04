import { Card, Text } from "@/components";
import { Colors } from "@/constants";
import { mvs } from "@/utils/metrices";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import { MenuItemProps } from "./props";

export const MenuItem = ({
  title,
  path,
  backgroundColor,
  textColor,
  rightText,
  isBadge,
  rightElement,
  onPress,
  icon,
}: MenuItemProps) => {
  const Icon = icon;

  return (
    <Card
      variant="outlined"
      style={{ marginTop: mvs(10), width: "100%" }}
      backgroundColor={backgroundColor || Colors.gray}
      contentStyle={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      onPress={onPress || (path ? () => router.navigate(path) : undefined)}
    >
      <View style={{ flexDirection: "row", gap: mvs(10), alignItems: "center" }}>
        {Icon && <Icon size={24} />}
        <Text style={{ color: textColor || Colors.text }}>{title}</Text>
      </View>

      {(path || onPress) && (
        <View style={{ flexDirection: "row", gap: mvs(10), alignItems: "center" }}>
          {rightElement ? (
            rightElement
          ) : rightText ? (
            isBadge ? (
              <View
                style={{
                  backgroundColor: "#CBEFDB",
                  paddingHorizontal: 12,
                  borderRadius: 16,
                }}
              >
                <Text style={{ color: "#2B9E66", fontSize: 14 }}>{rightText}</Text>
              </View>
            ) : (
              <Text variant="secondary">{rightText}</Text>
            )
          ) : null}
          <Ionicons name="chevron-forward" size={24} />
        </View>
      )}
    </Card>
  );
};
