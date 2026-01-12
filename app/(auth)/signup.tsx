import {
  BasicInformation,
  FormLayout,
  QBoxLocation,
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
    isSecondStepFormValid,
    isFirstStepFormValid,
    isLastStepFormValid,
  } = useSignup();

  return (
    <FormLayout
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
          isFormValid={
            currentStep === 1
              ? isFirstStepFormValid
              : currentStep === 2
              ? isSecondStepFormValid
              : currentStep === 3
              ? isLastStepFormValid
              : isFormValid
          }
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
          <QBoxLocation
            control={control}
            pickImage={pickImage}
            qboxImage={qboxImage}
          />
        )}
      </View>
    </FormLayout>
  );
};

export default SignUp;
