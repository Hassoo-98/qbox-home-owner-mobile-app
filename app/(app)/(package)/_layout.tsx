import { AppHeaderLeft } from "@/components";
import { Colors } from "@/constants";
import { useLocale } from "@/hooks";
import { Stack } from "expo-router";

export default function PackageStack() {
  const { t } = useLocale();

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
        options={{ title: t("package"), headerShown: false }}
      />
      <Stack.Screen name="sendPackage" options={{ title: t("sendPackage") }} />
      <Stack.Screen
        name="returnPackage"
        options={{ title: t("returnPackage") }}
      />
    </Stack>
  );
}
