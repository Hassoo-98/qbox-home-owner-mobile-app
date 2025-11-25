import { Button, Card, Text } from "@/components";
import { BorderRadius, Colors } from "@/constants";
import { mvs } from "@/utils/metrices";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

const ConfirmSignup = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        variant="filled"
        style={{ width: "90%" }}
        contentStyle={{ gap: mvs(10) }}
      >
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: BorderRadius.full,
            backgroundColor: Colors.success,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <Ionicons size={22} name="checkmark-sharp" color={Colors.white} />
        </View>
        <Text size="lg" style={{ textAlign: "center", fontWeight: "bold" }}>
          Your request has been submitted for approval.
        </Text>
        <Text variant="secondary" size="sm" style={{ textAlign: "center" }}>
          Once approved, we’ll send you confirmation email.
        </Text>
        <Button
          title="Confirm"
          style={{ marginTop: mvs(8) }}
          onPress={() => router.dismissTo("/(auth)")}
        />
      </Card>
    </View>
  );
};

export default ConfirmSignup;

const styles = StyleSheet.create({});
