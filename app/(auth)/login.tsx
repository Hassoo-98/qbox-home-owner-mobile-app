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
import { AUTH_PROVIDER_OPTIONS, AUTH_PROVIDERS, Spacing } from "@/constants";
import { useAuth } from "@/hooks";
import { LoginFormValues } from "@/types";
import { LoginFormResolver } from "@/utils";
import { router } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";

export const Login = () => {
  const { login } = useAuth();
  const [selectedAuthProvider, setSelectedAuthProvider] = useState<string>(
    AUTH_PROVIDERS.PHONE
  );

  const defaultFormValues = {
    email: "",
    password: "",
    phone: "",
  };

  const {
    control,
    formState: { isDirty },
    reset,
    handleSubmit,
  } = useForm<LoginFormValues>({
    defaultValues: defaultFormValues,
    resolver: LoginFormResolver,
    mode: "onChange",
  });

  const onSubmit = (data: LoginFormValues) => {
    console.log("login submission: ", JSON.stringify(data, null, 4));
    login("fake_token_123");
  };

  const handleAuthProviderChange = (option: string) => {
    setSelectedAuthProvider(option);
    reset(defaultFormValues);
  };

  return (
    <AuthScreenLayout
      title="Welcome Back!"
      description="Sign in to your Qbox account."
      headerContent={
        <SegmentedControl
          options={AUTH_PROVIDER_OPTIONS}
          style={{ marginVertical: Spacing.md }}
          onChange={handleAuthProviderChange}
          value={selectedAuthProvider}
        />
      }
    >
      <Form>
        {selectedAuthProvider === AUTH_PROVIDERS.EMAIL ? (
          <TextInput
            name="email"
            inputMode="email"
            control={control}
            autoCapitalize="none"
            autoComplete="email"
            label="Email Address"
            keyboardType="email-address"
            placeholder="Enter email address"
          />
        ) : (
          <PhoneNumberInput
            name="phone"
            control={control}
            label="Phone Number"
            placeholder="+966 XX XXX XXXX"
            defaultCode="PK"
          />
        )}
        <PasswordInput
          name="password"
          control={control}
          autoComplete="password"
          label="Password"
          placeholder="Enter password"
        />

        <View style={{ alignItems: "flex-end" }}>
          <HapticPressable href={"/forgotPassword"}>
            <Text size="sm">Forgot Password?</Text>
          </HapticPressable>
        </View>

        <Button
          style={{ marginTop: Spacing.xl }}
          title="Sign in"
          disabled={!isDirty}
          onPress={handleSubmit(onSubmit)}
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
