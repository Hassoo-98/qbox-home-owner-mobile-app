import { AuthScreenLayout, Button, Form, OTPInput, Text } from "@/components";
import { AUTH_PROVIDERS, Spacing } from "@/constants";
import { router, useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";

export const OtpVerification = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      otp: "",
    },
  });

  const { authOption, authValue, origin } = useLocalSearchParams();

  console.log("origin", origin);

  const onSubmit = (data: any) => {
    console.log("otp submission: ", data);
    if (origin === "signup") {
      router.dismissTo({
        pathname: "/signup",
        params: {
          origin: "otpVerification",
        },
      });
      return;
    }
    router.navigate("/resetPassword");
  };

  const isPhone = authOption === AUTH_PROVIDERS.PHONE;

  return (
    <AuthScreenLayout
      title="Enter Verification Code"
      description={`Enter the 5 digit otp code send on your ${
        isPhone ? "phone number" : "email address"
      } ${authValue}`}
    >
      <Form style={{ paddingTop: Spacing.lg }}>
        <OTPInput
          name="otp"
          control={control}
          numberOfDigits={5}
          rules={{
            required: "OTP is required",
          }}
        />

        <Text
          style={{
            textAlign: "center",
            marginTop: Spacing.md,
          }}
        >
          Didn’t receive code?{" "}
          <Text variant="primary" style={{ fontWeight: "bold" }}>
            Resend again
          </Text>
        </Text>

        <Button
          style={{ marginTop: Spacing.xl }}
          title="Confirm"
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
    </AuthScreenLayout>
  );
};

export default OtpVerification;
