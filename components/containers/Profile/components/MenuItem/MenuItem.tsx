import { Card, Text } from "@/components";
import { Colors } from "@/constants";
import { mvs } from "@/utils/metrices";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import { MenuItemProps } from "./props";

export const MenuItem = ({ item }: MenuItemProps) => {
  const Icon = item.icon;

  console.log("testing item ==========>", JSON.stringify(item, null, 4));

  return (
    <Card
      variant="outlined"
      style={{ marginTop: mvs(10), width: "100%" }}
      backgroundColor={item?.backgroundColor || Colors.gray}
      contentStyle={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      onPress={() => item?.path && router.navigate(item.path)}
    >
      <View style={{ flexDirection: "row", gap: mvs(10) }}>
        <Icon size={24} />
        <Text style={{ color: item?.textColor || Colors.text }}>
          {item.title}
        </Text>
      </View>

      {item?.path && (
        <View style={{ flexDirection: "row", gap: mvs(10) }}>
          {item.rightText && <Text variant="secondary">{item.rightText}</Text>}
          <Ionicons name="chevron-forward" size={24} />
        </View>
      )}
    </Card>
  );
};
