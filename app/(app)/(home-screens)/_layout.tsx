import { Stack } from "expo-router";

export default function HomeStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen
        name="qrCodeHistory"
        options={{ title: "QR Code History" }}
      />
    </Stack>
  );
}
