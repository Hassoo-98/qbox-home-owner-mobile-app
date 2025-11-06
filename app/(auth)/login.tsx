import {
  AuthScreenLayout,
  Button,
  Form,
  HapticPressable,
  PasswordInput,
  PhoneNumberInput,
  SegmentedControl,
  Text,
  TextInput,
} from "@/components";
import { Spacing } from "@/constants";
import { AuthContext } from "@/context";
import { router } from "expo-router";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";

export const Login = () => {
  const { login } = useContext(AuthContext);
  const [selectedLoginOption, setSelectedLoginOption] =
    useState<string>("phone");

  const loginOptions = [
    { label: "Phone Number", value: "phone" },
    { label: "Email Address", value: "email" },
  ];

  const { control } = useForm({
    defaultValues: {
      email: "",
      password: "",
      phone: "",
    },
  });

  return (
    <AuthScreenLayout
      title="Welcome Back!"
      description="Sign in to your Qbox account."
      headerContent={
        <SegmentedControl
          options={loginOptions}
          style={{ marginVertical: Spacing.md }}
          onChange={(option) => setSelectedLoginOption(option)}
          value={selectedLoginOption}
        />
      }
    >
      <Form>
        {selectedLoginOption === "email" ? (
          <TextInput
            name="email"
            inputMode="email"
            control={control}
            label="Email Address"
            keyboardType="email-address"
            placeholder="Enter email address"
          />
        ) : (
          <PhoneNumberInput
            name="phoneNumber"
            control={control}
            label="Phone Number"
            placeholder="+966 XX XXX XXXX"
            defaultCode="PK"
          />
        )}
        <PasswordInput
          name="password"
          control={control}
          label="Password"
          placeholder="Enter password"
        />

        <View style={{ alignItems: "flex-end" }}>
          <HapticPressable
            onPress={() => router.navigate("/(auth)/forgotPassword")}
          >
            <Text size="sm">Forgot Password?</Text>
          </HapticPressable>
        </View>

        <Button
          style={{ marginTop: Spacing.xl }}
          title="Sign in"
          onPress={() => login("fake_token_123")}
        />

        <Text style={{ textAlign: "center", marginTop: Spacing.md }}>
          Don’t have an account?{" "}
          <Text
            variant="primary"
            style={{ fontWeight: "bold" }}
            onPress={() => router.navigate("/(auth)/signup")}
          >
            Sign up
          </Text>
        </Text>
      </Form>
    </AuthScreenLayout>
  );
};

export default Login;
