import { AuthContext } from "@/context/AuthContext";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useContext, useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export const AppNavigation = () => {
  const { userToken, isLoading } = useContext(AuthContext);

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
    </Stack>
  );
};

export default AppNavigation;
