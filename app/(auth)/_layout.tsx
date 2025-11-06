import { Stack } from "expo-router";

export const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Welcome",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: "Sign In",
          headerShadowVisible: false,
          headerBackButtonDisplayMode: "minimal",
          headerTitleAlign: "left",
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: "Sign Up",
          headerShadowVisible: false,
          headerBackButtonDisplayMode: "minimal",
          headerTitleAlign: "left",
        }}
      />
      <Stack.Screen
        name="forgotPassword"
        options={{
          title: "Forgot Password",
          headerShadowVisible: false,
          headerBackButtonDisplayMode: "minimal",
          headerTitleAlign: "left",
        }}
      />
      <Stack.Screen
        name="otpVerification"
        options={{
          title: "OTP Verification",
          headerShadowVisible: false,
          headerBackButtonDisplayMode: "minimal",
          headerTitleAlign: "left",
        }}
      />
    </Stack>
  );
};

export default AuthLayout;
