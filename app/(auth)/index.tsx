import { Button, Text } from "@/components";
import { Colors, Spacing } from "@/constants";
import { router } from "expo-router";
import { Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const Welcome = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundCircle} />

      <Image
        source={require("@/assets/images/welcome-locker.png")}
        style={styles.lockerImage}
        resizeMode="contain"
      />

      <View style={styles.textContent}>
        <Text size="xl" style={styles.title}>
          Unlock the Future of Delivery
        </Text>
        <Text style={styles.subtitle}>
          Smart lockers powered by cloud technology
        </Text>
      </View>

      <View style={styles.spacer} />

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 80,
  },
  backgroundCircle: {
    width: 520.98,
    height: 580.47,
    backgroundColor: Colors.primary,
    top: -310,
    borderRadius: 1000,
    transform: [{ rotate: "-4.44deg" }],
    left: -76.94,
    position: "absolute",
  },
  lockerImage: {
    position: "relative",
    width: 300,
    height: 400,
    marginTop: Spacing.xl,
  },
  textContent: {
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.xxl,
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
  spacer: {
    flex: 1,
  },
  link: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  signupText: {
    color: Colors.secondaryText,
    fontSize: 16,
    textAlign: "center",
  },
});

export default Welcome;
