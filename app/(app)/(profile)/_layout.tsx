import { AppHeaderLeft, ProfileHeader } from "@/components";
import { ProfileProvider } from "@/context";
import { useLocale } from "@/hooks";
import { Stack } from "expo-router";

export default function ProfileStack() {
  const { t } = useLocale();

  return (
    <ProfileProvider>
      <Stack
        screenOptions={{
          headerLeft: () => <AppHeaderLeft canGoBack={true} />,
          headerShadowVisible: false,
          headerTitleAlign: "left",
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: t("profile"), headerShown: false }}
        />
        <Stack.Screen
          name="basicInformation"
          options={{
            title: t("basicInformation"),
            headerRight: () => {
              return <ProfileHeader />;
            },
          }}
        />
        <Stack.Screen
          name="passwordManager"
          options={{
            title: t("password"),
            headerRight: () => {
              return <ProfileHeader />;
            },
          }}
        />
        <Stack.Screen
          name="appLanguage"
          options={{
            title: t("language"),
            headerRight: () => {
              return <ProfileHeader />;
            },
          }}
        />
        <Stack.Screen
          name="myQBoxLocation"
          options={{
            title: t("myQBoxLocation"),
            headerRight: () => {
              return <ProfileHeader />;
            },
          }}
        />
        <Stack.Screen
          name="subscriptionHistory"
          options={{
            title: t("subscriptionHistory"),
          }}
        />
        <Stack.Screen
          name="wifiList"
          options={{
            title: t("wifi"),
          }}
        />
        <Stack.Screen
          name="bluetoothList"
          options={{
            title: t("bluetooth"),
          }}
        />
        <Stack.Screen
          name="promoCode"
          options={{
            title: t("promoCode"),
          }}
        />
        <Stack.Screen
          name="renewSubscription"
          options={{
            title: t("renewSubscription"),
            headerRight: () => {
              return <ProfileHeader />;
            },
          }}
        />
        <Stack.Screen
          name="bleWifiProvisioning"
          options={{
            title: t("wifiProvisioning"),
          }}
        />
        <Stack.Screen
          name="telemetry"
          options={{
            title: t("telemetry"),
          }}
        />
      </Stack>
    </ProfileProvider>
  );
}
