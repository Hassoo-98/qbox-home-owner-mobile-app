import { Button, Card, Text } from "@/components";
import { Colors } from "@/constants";
import React from "react";
import { View } from "react-native";

export const SubscriptionCard = () => {
  return (
    <Card variant="filled" backgroundColor={Colors.primary}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <View>
          <Text size="xs" style={{ color: Colors.white }}>
            Expires on 11/02/2025
          </Text>
          <Text style={{ fontWeight: "600", color: Colors.white }}>
            Standard Subscription Plan
          </Text>
        </View>

        <Button
          variant="default"
          size="sm"
          title="Renew"
          textStyle={{ color: Colors.secondary }}
        />
      </View>
    </Card>
  );
};
