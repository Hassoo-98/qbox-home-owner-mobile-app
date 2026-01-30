import { Button, Card, Text } from "@/components";
import { Colors } from "@/constants";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import { styles } from "./styles";

export const SubscriptionCard = () => {
  return (
    <Card variant="filled" backgroundColor={Colors.primary}>
      <View style={styles.row}>
        <View>
          <Text size="xs" style={styles.expiryText}>
            Expires on 11/02/2025
          </Text>
          <Text style={styles.planText}>
            Standard Subscription Plan
          </Text>
        </View>

        <Button
          variant="default"
          size="sm"
          title="Renew"
          textStyle={styles.buttonText}
          onPress={() => router.navigate("/renewSubscription")}
        />
      </View>
    </Card>
  );
};
