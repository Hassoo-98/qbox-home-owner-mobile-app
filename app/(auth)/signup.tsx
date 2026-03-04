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
    validateStep,
    onSubmit,
    control,
    contact,
    pickImage,
    qboxImage,
    handleSendOtp,
    handleVerifyOtp,
    handleCheckQBox,
    isQBoxVerified,
    isQBoxChecking,
    getValues,
    handleCheckShortAddress,
    isShortAddressVerified,
    isShortAddressChecking,
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
          validateStep={validateStep}
          onSubmit={onSubmit}
          phoneNumber={contact}
          handleSendOtp={handleSendOtp}
          handleVerifyOtp={handleVerifyOtp}
          isQBoxVerified={isQBoxVerified}
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
            getValues={getValues}
            handleCheckShortAddress={handleCheckShortAddress}
            isShortAddressVerified={isShortAddressVerified}
            isShortAddressChecking={isShortAddressChecking}
          />
        )}
      </View>
    </FormLayout>
  );
};

export default SignUp;
