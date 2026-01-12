import {
  Button,
  Form,
  FormLayout,
  PhoneNumberInput,
  SegmentedControl,
  Text,
  TextInput,
} from "@/components";
import { AUTH_PROVIDER_OPTIONS, AUTH_PROVIDERS, Spacing } from "@/constants";
import { useModal } from "@/hooks";
import { ForgotPasswordFormValues } from "@/types";
import { ForgotPasswordFormResolver } from "@/utils";
import { router } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const ForgotPassword = () => {
  const [selectedAuthProvider, setSelectedAuthProvider] = useState<string>(
    AUTH_PROVIDERS.PHONE
  );

  const defaultFormValues = {
    email: "",
    phone: "",
  };
  const {
    control,
    formState: { isDirty },
    reset,
    handleSubmit,
    getValues,
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: defaultFormValues,
    resolver: ForgotPasswordFormResolver,
    mode: "onChange",
  });

  const isFormValid = isDirty;

  const { onTriggerModal } = useModal();

  const handleVerify = (type: string) => {
    const { email, phone } = getValues();
    const subtitle =
      type === "phone"
        ? `Enter the 5-digit code sent to your phone number ${phone}`
        : `Enter the 5-digit code sent to your ${email} email.`;
    onTriggerModal({
      modalType: "otp",
      title: "OTP Verification",
      subtitle: subtitle,
      footerText: "Remember Password ? Back to",
      footerAction: "Login",
      isForgotPassowrd: true,
      secondaryButtonHandler: () => {
        router.dismissTo("/login");
      },
      primaryButtonHandler: () => {
        router.navigate("/resetPassword");
      },
    });
  };

  const onSubmit = (data: ForgotPasswordFormValues) => {
    console.log("forgot password submission: ", data);
    handleVerify(selectedAuthProvider === "phone" ? "phone" : "email");
  };

  const handleAuthProviderChange = (option: string) => {
    setSelectedAuthProvider(option);
    reset(defaultFormValues);
  };

  return (
    <FormLayout
      title="Forgot Password?"
      description={`Enter your ${
        selectedAuthProvider === "phone" ? "phone number" : "email address"
      } and we'll send you instructions to reset your password.`}
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
        {selectedAuthProvider === "email" ? (
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
            name="phone"
            control={control}
            label="Phone Number"
            placeholder="+966 XX XXX XXXX"
            defaultCode="PK"
          />
        )}

        <Button
          style={{ marginTop: Spacing.xl }}
          title="Reset Password"
          disabled={!isFormValid}
          onPress={handleSubmit(onSubmit)}
        />

        <Text
          style={{
            textAlign: "center",
            marginTop: Spacing.md,
          }}
        >
          Remember Password? Back to{" "}
          <Text
            variant="primary"
            style={{ fontWeight: "bold" }}
            onPress={() => router.dismissTo("/login")}
          >
            Login
          </Text>
        </Text>
      </Form>
    </FormLayout>
  );
};

export default ForgotPassword;
