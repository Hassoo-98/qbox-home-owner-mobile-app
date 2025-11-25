import {
  AuthScreenLayout,
  BasicInformation,
  SignupAddress,
  SignupFooter,
  TextInput,
} from "@/components";
import { Spacing } from "@/constants";
import { useSignup } from "@/hooks";
import { View } from "react-native";

export const SignUp = () => {
  const {
    currentStep,
    setCurrentStep,
    isFormValid,
    onSubmit,
    control,
    phoneNumber,
    pickImage,
    qboxImage,
  } = useSignup();

  return (
    <AuthScreenLayout
      title={
        currentStep === 1
          ? "Basic Information"
          : currentStep === 2
          ? "Verify QBox"
          : "Address"
      }
      description={
        currentStep === 1
          ? "Let's begin with basic information."
          : currentStep === 2
          ? "Add serial number mentioned on the QBox."
          : "Where should we install your QBox?"
      }
      currentStep={currentStep}
      totalSteps={3}
      stepperStyle={{ marginBottom: Spacing.md }}
      footer={
        <SignupFooter
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          isFormValid={isFormValid}
          onSubmit={onSubmit}
          phoneNumber={phoneNumber}
        />
      }
    >
      <View
        style={{
          marginTop: Spacing.md,
          paddingHorizontal: Spacing.xl,
        }}
      >
        {currentStep === 1 ? (
          <BasicInformation control={control} />
        ) : currentStep === 2 ? (
          <TextInput
            name="qBoxId"
            inputMode="text"
            control={control}
            endButtonText="Check"
            autoCorrect={false}
            label="QBox ID"
            placeholder="Enter your full name"
          />
        ) : (
          <SignupAddress
            control={control}
            pickImage={pickImage}
            qboxImage={qboxImage}
          />
        )}
      </View>
    </AuthScreenLayout>
  );
};

export default SignUp;
