import {
  FormLayout,
  PackageInformation,
  ReturnPackageFooter,
  TextInput,
} from "@/components";
import { useLocale, useReturnPackage } from "@/hooks";
import { View } from "react-native";
import { styles } from "./form.styles";

export const ReturnPackage = () => {
  const { t } = useLocale();
  const {
    currentStep,
    setCurrentStep,
    isFormValid,
    onSubmit,
    control,
    returnPackageImage,
    pickImage,
    isPending,
  } = useReturnPackage();

  return (
    <FormLayout
      title={t("packageInformation")}
      description={t("enterPinCode")}
      currentStep={currentStep}
      totalSteps={2}
      stepperStyle={styles.stepper}
      footer={
        <ReturnPackageFooter
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          isFormValid={isFormValid}
          onSubmit={onSubmit}
          isPending={isPending}
        />
      }
    >
      <View style={styles.container}>
        {currentStep === 1 ? (
          <TextInput
            name="pinCode"
            inputMode="text"
            control={control}
            endButtonText={t("check")}
            autoCorrect={false}
            label={t("pinCode")}
            placeholder={t("enterPinCode")}
          />
        ) : (
          <PackageInformation
            control={control}
            packageImage={returnPackageImage}
            pickImage={pickImage}
          />
        )}
      </View>
    </FormLayout>
  );
};

export default ReturnPackage;
