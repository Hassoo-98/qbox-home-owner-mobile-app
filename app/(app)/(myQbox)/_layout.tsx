import { Stack } from "expo-router";

export default function MyQBoxStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "MyQBox" }} />
    </Stack>
  );
}
