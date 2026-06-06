import { Stack } from "expo-router";
import { useLocale } from "@/hooks";

export const AuthLayout = () => {
  const { t } = useLocale();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: t("welcome"),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: t("signIn"),
          headerShadowVisible: false,
          headerBackButtonDisplayMode: "minimal",
          headerTitleAlign: "left",
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: t("signUp"),
          headerShadowVisible: false,
          headerBackButtonDisplayMode: "minimal",
          headerTitleAlign: "left",
        }}
      />
      <Stack.Screen
        name="forgotPassword"
        options={{
          title: t("forgotPassword"),
          headerShadowVisible: false,
          headerBackButtonDisplayMode: "minimal",
          headerTitleAlign: "left",
        }}
      />
      <Stack.Screen
        name="resetPassword"
        options={{
          title: t("createSecurePassword"),
          headerShadowVisible: false,
          headerBackButtonDisplayMode: "minimal",
          headerTitleAlign: "left",
        }}
      />
    </Stack>
  );
};

export default AuthLayout;
