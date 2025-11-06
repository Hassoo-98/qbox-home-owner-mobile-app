import {
  AuthScreenLayout,
  Button,
  Form,
  PhoneNumberInput,
  SegmentedControl,
  Text,
  TextInput,
} from "@/components";
import { Spacing } from "@/constants";
import { router } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const ForgotPassword = () => {
  const [selectedAuthOption, setSelectedAuthOption] = useState<string>("phone");

  const authOptions = [
    {
      label: "Phone Number",
      value: "phone",
    },
    {
      label: "Email Address",
      value: "email",
    },
  ];

  const { control } = useForm({
    defaultValues: {
      email: "",
      phone: "",
    },
  });

  return (
    <AuthScreenLayout
      title="Forgot Password?"
      description={`Enter your ${
        selectedAuthOption === "phone" ? "phone number" : "email address"
      } and we'll send you instructions to reset your password.`}
      headerContent={
        <SegmentedControl
          options={authOptions}
          style={{ marginVertical: Spacing.md }}
          onChange={(option) => setSelectedAuthOption(option)}
          value={selectedAuthOption}
        />
      }
    >
      <Form>
        {selectedAuthOption === "email" ? (
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

        <Button
          style={{ marginTop: Spacing.xl }}
          title="Reset Password"
          onPress={() => router.navigate("/(auth)/otpVerification")}
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
