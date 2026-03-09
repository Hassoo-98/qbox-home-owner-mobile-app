import {
  DeliveryInformation,
  FormLayout,
  PackageInformation,
  RecipientInformation,
  SendPackageFooter,
} from "@/components";
import { useSendPackage } from "@/hooks";
import { View } from "react-native";
import { styles } from "./form.styles";

export const SendPackage = () => {
  const {
    currentStep,
    setCurrentStep,
    isFormValid,
    onSubmit,
    control,
    setValue,
    phoneNumber,
    pickImage,
    qboxImage,
    isPending,
  } = useSendPackage();

  return (
    <FormLayout
      title={
        currentStep === 1
          ? "Recipient Information"
          : currentStep === 2
            ? "Package Information "
            : "Delivery Information "
      }
      description={"Let’s begin with basic information. "}
      currentStep={currentStep}
      totalSteps={3}
      stepperStyle={styles.stepper}
      footer={
        <SendPackageFooter
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          isFormValid={isFormValid}
          onSubmit={onSubmit}
          phoneNumber={phoneNumber}
          isPending={isPending}
        />
      }
    >
      <View style={styles.container}>
        {currentStep === 1 ? (
          <RecipientInformation control={control} />
        ) : currentStep === 2 ? (
          <PackageInformation
            control={control}
            packageImage={qboxImage}
            pickImage={pickImage}
          />
        ) : (
          <DeliveryInformation control={control} setValue={setValue} />
        )}
      </View>
    </FormLayout>
  );
};

export default SendPackage;
