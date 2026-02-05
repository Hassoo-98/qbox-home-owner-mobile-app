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
import { useSendOtpForResetPassword, useVerifyOtpForResetPassword } from "@/hooks/api/useAuthQueries";
import { ForgotPasswordFormValues } from "@/types";
import { ForgotPasswordFormResolver } from "@/utils";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";

export const ForgotPassword = () => {
  const [selectedAuthProvider, setSelectedAuthProvider] = useState<string>(
    AUTH_PROVIDERS.PHONE
  );

  // Store temp_uid and contact for later steps
  const tempUidRef = useRef<string>("");
  const contactRef = useRef<string>("");

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
  const sendOtpMutation = useSendOtpForResetPassword();
  const verifyOtpMutation = useVerifyOtpForResetPassword();

  const handleVerifyOtp = (otp: string) => {
    const contact = selectedAuthProvider === "phone" ? (getValues("phone") || "") : (getValues("email") || "");
    const method = selectedAuthProvider === "phone" ? "phone" : "email";

    verifyOtpMutation.mutate(
      {
        otp,
        [method === "phone" ? "phone_number" : "email"]: contact,
      },
      {
        onSuccess: (response) => {
          console.log("Forgot password OTP verify success:", response);
          // Navigate to reset password screen with the uid
          const uid = response?.temp_uid || response?.data?.temp_uid || tempUidRef.current;
          router.push({
            pathname: "/resetPassword",
            params: {
              uid,
              contact,
              method
            }
          });
        },
      }
    );
  };

  const handleSendOtp = (type: string, contact: string) => {
    const subtitle =
      type === "phone"
        ? `Enter the 6-digit code sent to your phone number ${contact}`
        : `Enter the 6-digit code sent to your ${contact} email.`;

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
      primaryButtonHandler: (otpValue?: any) => handleVerifyOtp(otpValue as string),
    });
  };

  const onSubmit = (data: ForgotPasswordFormValues) => {
    const contact = selectedAuthProvider === "phone" ? (data.phone || "") : (data.email || "");
    const method = selectedAuthProvider === "phone" ? "phone" : "email";

    if (!contact) {
      Alert.alert("Error", `Please enter your ${method === "phone" ? "phone number" : "email address"}.`);
      return;
    }

    contactRef.current = contact;

    const payload: any = {
      [method === "phone" ? "phone_number" : "email"]: contact,
      is_forget_otp: true,
      is_home_owner: true,
    };

    console.log("Forgot password OTP request payload:", JSON.stringify(payload, null, 2));

    sendOtpMutation.mutate(
      payload,
      {
        onSuccess: (response) => {
          console.log("Forgot password OTP send success:", response);
          // Store temp_uid for later use (if provided by server)
          const uid = response?.temp_uid || response?.data?.temp_uid;
          if (uid) {
            tempUidRef.current = uid;
          }
          handleSendOtp(method, contact);
        },
      }
    );
  };

  const handleAuthProviderChange = (option: string) => {
    setSelectedAuthProvider(option);
    reset(defaultFormValues);
  };

  return (
    <FormLayout
      title="Forgot Password?"
      description={`Enter your ${selectedAuthProvider === "phone" ? "phone number" : "email address"
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
          loading={sendOtpMutation.isPending}
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
