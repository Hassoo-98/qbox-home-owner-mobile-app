import {
  Button,
  Form,
  FormLayout,
  HapticPressable,
  PasswordInput,
  PhoneNumberInput,
  SegmentedControl,
  Text,
  TextInput,
} from "@/components";
import { AUTH_PROVIDERS, Spacing } from "@/constants";
import { useLocale } from "@/hooks";
import { useLogin } from "@/hooks/api/useAuthQueries";
import { LoginPayload } from "@/services/api/types";
import { LoginFormValues } from "@/types";
import { LoginFormResolver } from "@/utils";
import { router } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";

export const Login = () => {
  const { t } = useLocale();
  const { mutate: loginUser, isPending } = useLogin();
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
    const payload = {
      password: data.password,
      ...(selectedAuthProvider === AUTH_PROVIDERS.EMAIL
        ? { email: data.email }
        : { phone_number: data.phone }),
    };

    loginUser(payload as LoginPayload);
  };

  const handleAuthProviderChange = (option: string) => {
    setSelectedAuthProvider(option);
    reset(defaultFormValues);
  };

  return (
    <FormLayout
      title={t("welcomeBack")}
      description={t("signInToAccount")}
      headerContent={
        <SegmentedControl
          options={[
            { label: t("phoneNumber"), value: AUTH_PROVIDERS.PHONE },
            { label: t("emailAddress"), value: AUTH_PROVIDERS.EMAIL },
          ]}
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
            label={t("emailAddress")}
            keyboardType="email-address"
            placeholder={t("enterEmailAddress")}
          />
        ) : (
          <PhoneNumberInput
            name="phone"
            control={control}
            label={t("phoneNumber")}
            placeholder="+966 XX XXX XXXX"
            defaultCode="PK"
          />
        )}
        <PasswordInput
          name="password"
          control={control}
          autoComplete="password"
          label={t("password")}
          placeholder={t("enterNewPassword")}
        />

        <View style={{ alignItems: "flex-end" }}>
          <HapticPressable href={"/forgotPassword"}>
            <Text size="sm">{t("forgotPassword")}</Text>
          </HapticPressable>
        </View>

        <Button
          style={{ marginTop: Spacing.xl }}
          title={t("signIn")}
          disabled={!isDirty || isPending}
          loading={isPending}
          onPress={handleSubmit(onSubmit)}
        />

        <Text style={{ textAlign: "center", marginTop: Spacing.md }}>
          {t("dontHaveAccount")}{" "}
          <Text
            variant="primary"
            style={{ fontWeight: "bold" }}
            onPress={() => router.navigate("/(auth)/signup")}
          >
            {t("signUp")}
          </Text>
        </Text>
      </Form>
    </FormLayout>
  );
};

export default Login;
