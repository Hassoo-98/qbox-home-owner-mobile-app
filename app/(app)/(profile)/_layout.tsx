import { AppHeaderLeft, Button } from "@/components";
import { Stack } from "expo-router";

export default function ProfileStack() {
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
        options={{ title: "Profile", headerShown: false }}
      />
      <Stack.Screen
        name="basicInformation"
        options={{
          title: "Basic Information",
          headerRight: () => {
            return <Button title="Save" variant="transparent" />;
          },
        }}
      />
      <Stack.Screen
        name="passwordManager"
        options={{
          title: "Password",
          headerRight: () => {
            return <Button title="Save" variant="transparent" />;
          },
        }}
      />
      <Stack.Screen
        name="appLanguage"
        options={{
          title: "Language",
          headerRight: () => {
            return <Button title="Save" variant="transparent" />;
          },
        }}
      />
      <Stack.Screen
        name="myQBoxLocation"
        options={{
          title: "My QBox Location",
          headerRight: () => {
            return <Button title="Save" variant="transparent" />;
          },
        }}
      />
      <Stack.Screen
        name="suscriptionHistory"
        options={{
          title: "Subscription History",
        }}
      />
    </Stack>
  );
}
