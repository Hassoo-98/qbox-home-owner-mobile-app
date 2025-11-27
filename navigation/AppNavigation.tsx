import { useAuth } from "@/hooks";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export const AppNavigation = () => {
  const { isLoading, userToken } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <Stack>
      <Stack.Protected guard={Boolean(userToken)}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!Boolean(userToken)}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Screen
        name="otpVerification"
        options={{
          title: "OTP Verification",
          headerShadowVisible: false,
          headerBackButtonDisplayMode: "minimal",
          headerTitleAlign: "left",
          presentation: "modal",
        }}
      />
    </Stack>
  );
};

export default AppNavigation;
