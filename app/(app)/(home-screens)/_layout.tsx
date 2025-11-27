import { Colors } from "@/constants";
import { Stack } from "expo-router";

export default function HomeStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerTitleAlign: "left",
        headerStyle: {
          backgroundColor: Colors.gray,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Home", headerShown: false }}
      />
      <Stack.Screen
        name="qrCodeHistory"
        options={{ title: "QR Code History" }}
      />
      <Stack.Screen
        name="qrCodeDetails/[id]"
        options={{ title: "QR Code Details" }}
      />
    </Stack>
  );
}
