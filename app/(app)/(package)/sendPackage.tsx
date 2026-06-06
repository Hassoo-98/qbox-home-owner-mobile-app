import {
  DeliveryInformation,
  FormLayout,
  PackageInformation,
  RecipientInformation,
  SendPackageFooter,
} from "@/components";
import { useLocale, useSendPackage } from "@/hooks";
import { View } from "react-native";
import { styles } from "./form.styles";

export const SendPackage = () => {
  const { t } = useLocale();
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
    verifyQBox,
    isQBoxVerified,
    isVerifyingQBox,
    paymentMethods,
    validateStep,
    isPending,
  } = useSendPackage();

  return (
    <FormLayout
      title={
        currentStep === 1
          ? t("recipientInformation")
          : currentStep === 2
            ? t("packageInformation")
            : t("deliveryInformation")
      }
      description={t("basicInformation")}
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
          isQBoxVerified={isQBoxVerified}
          validateStep={validateStep}
        />
      }
    >
      <View style={styles.container}>
        {currentStep === 1 ? (
          <RecipientInformation
            control={control}
            onVerifyQBox={verifyQBox}
            isQBoxVerified={isQBoxVerified}
            isVerifyingQBox={isVerifyingQBox}
          />
        ) : currentStep === 2 ? (
          <PackageInformation
            control={control}
            packageImage={qboxImage}
            pickImage={pickImage}
          />
        ) : (
          <DeliveryInformation
            control={control}
            setValue={setValue}
            paymentMethods={paymentMethods}
          />
        )}
      </View>
    </FormLayout>
  );
};

export default SendPackage;
