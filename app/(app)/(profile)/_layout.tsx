import { AppHeaderLeft, ProfileHeader } from "@/components";
import { ProfileProvider } from "@/context";
import { Stack } from "expo-router";

export default function ProfileStack() {
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
          options={{ title: "Profile", headerShown: false }}
        />
        <Stack.Screen
          name="basicInformation"
          options={{
            title: "Basic Information",
            headerRight: () => {
              return <ProfileHeader />;
            },
          }}
        />
        <Stack.Screen
          name="passwordManager"
          options={{
            title: "Password",
            headerRight: () => {
              return <ProfileHeader />;
            },
          }}
        />
        <Stack.Screen
          name="appLanguage"
          options={{
            title: "Language",
            headerRight: () => {
              return <ProfileHeader />;
            },
          }}
        />
        <Stack.Screen
          name="myQBoxLocation"
          options={{
            title: "My QBox Location",
            headerRight: () => {
              return <ProfileHeader />;
            },
          }}
        />
        <Stack.Screen
          name="subscriptionHistory"
          options={{
            title: "Subscription History",
          }}
        />
        <Stack.Screen
          name="wifiList"
          options={{
            title: "Available Wi-Fi",
          }}
        />
        <Stack.Screen
          name="bluetoothList"
          options={{
            title: "Bluetooth Devices",
          }}
        />
        <Stack.Screen
          name="promoCode"
          options={{
            title: "Promo Codes",
          }}
        />
        <Stack.Screen
          name="renewSubscription"
          options={{
            title: "Renew Subscription",
            headerRight: () => {
              return <ProfileHeader />;
            },
          }}
        />
        <Stack.Screen
          name="bleWifiProvisioning"
          options={{
            title: "WiFi Provisioning",
          }}
        />
      </Stack>
    </ProfileProvider>
  );
}
