import { Card, Text } from "@/components";
import { Colors } from "@/constants";
import { mvs } from "@/utils/metrices";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import { Props } from "./props";

export const MenuItem: React.FC<Props> = ({ item }) => {
  const Icon = item.icon;

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
