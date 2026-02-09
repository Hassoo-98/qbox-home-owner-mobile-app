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
    contact,
    pickImage,
    qboxImage,
    isSecondStepFormValid,
    isFirstStepFormValid,
    isLastStepFormValid,
    handleSendOtp,
    handleVerifyOtp,
    handleCheckQBox,
    isQBoxVerified,
    isQBoxChecking,
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
                ? isSecondStepFormValid && isQBoxVerified
                : currentStep === 3
                  ? isLastStepFormValid
                  : isFormValid
          }
          onSubmit={onSubmit}
          phoneNumber={contact}
          handleSendOtp={handleSendOtp}
          handleVerifyOtp={handleVerifyOtp}
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
            endButtonText={isQBoxVerified ? "Verified" : "Check"}
            onEndButtonClick={handleCheckQBox}
            endButtonProps={{
              disabled: isQBoxVerified || isQBoxChecking,
              loading: isQBoxChecking,
              variant: isQBoxVerified ? "success" : "primary"
            }}
            autoCorrect={false}
            label="QBox ID"
            placeholder="Enter QBox ID"

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
