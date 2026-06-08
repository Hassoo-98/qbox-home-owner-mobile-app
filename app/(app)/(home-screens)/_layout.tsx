import { useLocale } from "@/hooks";
import { Colors } from "@/constants";
import { Stack } from "expo-router";

export default function HomeStack() {
  const { t } = useLocale();

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
        options={{ title: t("home"), headerShown: false }}
      />
      <Stack.Screen
        name="notification"
        options={{ title: "Notifications" }}
      />
      <Stack.Screen
        name="qrCodeHistory"
        options={{ title: t("qrCodeHistory") }}
      />
      <Stack.Screen
        name="qrCodeDetails/[id]"
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="offerDetails/[id]"
        options={{
          title: "",
        }}
      />
    </Stack>
  );
}
