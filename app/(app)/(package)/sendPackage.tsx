import {
  FormLayout,
  RecipientInformation,
  SendPackageFooter,
} from "@/components";
import { PackageInformation } from "@/components/common/PackageInformation";
import { DeliveryInformation } from "@/components/containers/Package/components/SendPackage/components/DeliveryInformation";
import { Spacing } from "@/constants";
import { useSendPackage } from "@/hooks";
import { View } from "react-native";

export const SendPackage = () => {
  const {
    currentStep,
    setCurrentStep,
    isFormValid,
    onSubmit,
    control,
    phoneNumber,
    pickImage,
    qboxImage,
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
      stepperStyle={{ marginBottom: Spacing.md }}
      footer={
        <SendPackageFooter
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
          <RecipientInformation control={control} />
        ) : currentStep === 2 ? (
          <PackageInformation
            control={control}
            packageImage={qboxImage}
            pickImage={pickImage}
          />
        ) : (
          <DeliveryInformation control={control} />
        )}
      </View>
    </FormLayout>
  );
};

export default SendPackage;
