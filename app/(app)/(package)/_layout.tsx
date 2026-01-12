import { AppHeaderLeft } from "@/components";
import { Colors } from "@/constants";
import { Stack } from "expo-router";

export default function PackageStack() {
  return (
    <Stack
      screenOptions={{
        headerLeft: () => <AppHeaderLeft canGoBack={true} />,
        headerShadowVisible: false,
        headerTitleAlign: "left",
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors.gray,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Packages", headerShown: false }}
      />
      <Stack.Screen name="sendPackage" options={{ title: "Send a Package" }} />
      <Stack.Screen
        name="returnPackage"
        options={{ title: "Return a Package" }}
      />
    </Stack>
  );
}
