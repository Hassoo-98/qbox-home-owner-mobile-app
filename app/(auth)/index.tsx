import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

import { Button, Text } from "@/components";
import { Colors, Spacing } from "@/constants";

const LOCKER_IMAGE = require("@/assets/images/welcome-locker.png");

export const Welcome = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor={Colors.primary} />

      <View style={styles.backgroundCircle} />

      <Image
        source={LOCKER_IMAGE}
        style={styles.lockerImage}
        resizeMode="cover"
      />

      <View style={styles.contentWrapper}>
        <Text size="xl" style={styles.title}>
          Deliver Smarter with QBOX
        </Text>
        <Text style={styles.subtitle}>
          Fast, Secure, and Hassle-Free Drop-Offs.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Sign in"
          fullWidth
          onPress={() => router.navigate("/(auth)/login")}
        />
        <Text style={styles.signupText}>
          Don’t have an account?{" "}
          <Text
            variant="primary"
            style={styles.link}
            onPress={() => router.navigate("/(auth)/signup")}
          >
            Sign up
          </Text>
        </Text>
      </View>
    </View>
  );
};

const CIRCLE_SIZE = 580;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.white,
    justifyContent: "center",
  },

  backgroundCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    backgroundColor: Colors.primary,
    borderRadius: CIRCLE_SIZE / 2,
    position: "absolute",
    top: -CIRCLE_SIZE * 0.55,
    left: -CIRCLE_SIZE * 0.15,
    transform: [{ rotate: "-4deg" }],
  },

  lockerImage: {
    width: "45%",
    height: "45%",
    position: "absolute",
    top: 80,
  },

  contentWrapper: {
    marginTop: "70%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },

  title: {
    fontWeight: "bold",
    textAlign: "center",
  },

  subtitle: {
    color: Colors.secondaryText,
    fontSize: 16,
    textAlign: "center",
  },

  buttonContainer: {
    position: "absolute",
    bottom: Spacing.lg,
    width: "100%",
    padding: Spacing.lg,
  },
  link: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  signupText: {
    color: Colors.secondaryText,
    fontSize: 16,
    textAlign: "center",
  },
});

export default Welcome;
