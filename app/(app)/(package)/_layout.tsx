import { AppHeaderLeft } from "@/components";
import { Stack } from "expo-router";

export default function PackageStack() {
  return (
    <Stack
      screenOptions={{
        headerLeft: () => <AppHeaderLeft canGoBack={true} />,
        headerShadowVisible: false,
        headerTitleAlign: "left",
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Packages", headerShown: false }}
      />
    </Stack>
  );
}
