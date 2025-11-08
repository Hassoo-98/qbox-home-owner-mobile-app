import { WarningIconOutline } from "@/assets/icons";
import {
  AuthScreenLayout,
  Button,
  PasswordInput,
  PhoneNumberInput,
  Text,
  TextInput,
} from "@/components";
import { AUTH_PROVIDERS, Colors, Spacing } from "@/constants";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";

export const SignUp = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const { origin } = useLocalSearchParams();

  const {
    control,
    formState: { isDirty },
    reset,
    watch,
    handleSubmit,
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (origin === "otpVerification") {
      setCurrentStep(2);
    }
  }, [origin]);

  const isFormValid = isDirty;

  const onSubmit = (data: any) => {
    console.log(
      "signup form submission submission: ",
      JSON.stringify(data, null, 4)
    );
  };

  const phoneNumber = watch("phone");

  return (
    <AuthScreenLayout
      title={currentStep === 1 ? "Basic Information" : "Verify QBox"}
      description={
        currentStep === 1
          ? "Let’s begin with basic information."
          : "Add serial number mentioned on the QBox."
      }
      currentStep={currentStep}
      totalSteps={4}
      stepperStyle={{ marginBottom: Spacing.md }}
    >
      <View style={{ marginTop: Spacing.md, paddingHorizontal: Spacing.xl }}>
        {currentStep === 1 ? (
          <>
            <TextInput
              name="firstName"
              inputMode="text"
              control={control}
              autoCapitalize="words"
              autoCorrect={false}
              label="Full Name"
              autoComplete="name"
              placeholder="Enter your full name"
            />
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
            <PhoneNumberInput
              name="phone"
              control={control}
              label="Phone Number"
              placeholder="+966 XX XXX XXXX"
              defaultCode="PK"
            />

            <PasswordInput
              name="password"
              control={control}
              label="Password"
              placeholder="Enter password"
            />

            <PasswordInput
              name="confirmPassword"
              control={control}
              label="Confirm Password"
              placeholder="Enter password"
            />
          </>
        ) : (
          <TextInput
            name="qBoxId"
            inputMode="text"
            control={control}
            endButtonText="Check"
            autoCorrect={false}
            label="QBox ID"
            placeholder="Enter your full name"
          />
        )}

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Button
            style={{ marginTop: Spacing.xl }}
            title="Previous"
            variant="default"
            disabled={currentStep === 1}
            onPress={() => setCurrentStep((prev) => --prev)}
          />
          <Button
            style={{ marginTop: Spacing.xl }}
            title="Next"
            disabled={currentStep === 4 || !isFormValid}
            onPress={() =>
              currentStep === 1
                ? router.navigate({
                    pathname: "/otpVerification",
                    params: {
                      authOption: AUTH_PROVIDERS.PHONE,
                      authValue: phoneNumber,
                      origin: "signup",
                    },
                  })
                : setCurrentStep((prev) => ++prev)
            }
          />
        </View>
      </View>
      <View
        style={{
          backgroundColor: Colors.warning,
          paddingVertical: Spacing.md,
          paddingHorizontal: Spacing.lg,
          marginHorizontal: Spacing.md + 4,
          flexDirection: "row",
        }}
      >
        <WarningIconOutline width={20} height={20} />
        <View>
          <Text size="sm" variant="warning" style={{ fontWeight: "bold" }}>
            Your data is secure
          </Text>
          <Text size="sm" variant="warning">
            All information is encrypted and stored securely. We comply with all
            data protection regulations.
          </Text>
        </View>
      </View>
    </AuthScreenLayout>
  );
};

export default SignUp;
