import {
  BasicInformation,
  FormLayout,
  QBoxLocation,
  SignupFooter,
  TextInput,
} from "@/components";
import { Spacing } from "@/constants";
import { useLocale, useSignup } from "@/hooks";
import { View } from "react-native";

export const SignUp = () => {
  const { t } = useLocale();
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
          ? t("basicInformation")
          : currentStep === 2
            ? t("verifyQBox")
            : t("address")
      }
      description={
        currentStep === 1
          ? t("basicInformation")
          : currentStep === 2
            ? t("verifyQBox")
            : t("address")
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
          contactInfo={contact}
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
            endButtonText={isQBoxVerified ? t("verified") : t("check")}
            onEndButtonClick={handleCheckQBox}
            endButtonProps={{
              disabled: isQBoxVerified || isQBoxChecking,
              loading: isQBoxChecking,
              variant: isQBoxVerified ? "success" : "primary",
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
