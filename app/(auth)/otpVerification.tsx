import { AuthScreenLayout, Button, Form, OTPInput, Text } from "@/components";
import { Spacing } from "@/constants";
import { router } from "expo-router";
import { useForm } from "react-hook-form";

export const ForgotPassword = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log("otp submission: ", data);
  };

  return (
    <AuthScreenLayout
      title="Enter Verification Code"
      description="Enter the 5 digit otp code send on your phone number +966 XX XXX XX33"
    >
      <Form style={{ paddingTop: Spacing.lg }}>
        <OTPInput
          name="otp"
          control={control}
          numberOfDigits={5}
          rules={{
            required: "OTP is required",
            minLength: {
              value: 6,
              message: "Please enter complete OTP",
            },
          }}
        />

        <Text
          style={{
            textAlign: "center",
            marginTop: Spacing.md,
          }}
        >
          Didn’t receive code?{" "}
          <Text
            variant="primary"
            style={{ fontWeight: "bold" }}
            // onPress={() => router.back()}
          >
            Resend again
          </Text>
        </Text>

        <Button
          style={{ marginTop: Spacing.xl }}
          title="Confirm"
          onPress={() => handleSubmit(onSubmit)}
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

export default ForgotPassword;
