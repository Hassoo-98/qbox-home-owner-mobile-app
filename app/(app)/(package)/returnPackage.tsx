import {
  FormLayout,
  PackageInformation,
  ReturnPackageFooter,
  TextInput,
} from "@/components";
import { Spacing } from "@/constants";
import { useReturnPackage } from "@/hooks";
import { View } from "react-native";

export const ReturnPackage = () => {
  const {
    currentStep,
    setCurrentStep,
    isFormValid,
    onSubmit,
    control,
    returnPackageImage,
    pickImage,
  } = useReturnPackage();

  return (
    <FormLayout
      title={"Package Infromation"}
      description={"Enter the infromation bellow."}
      currentStep={currentStep}
      totalSteps={2}
      stepperStyle={{ marginBottom: Spacing.md }}
      footer={
        <ReturnPackageFooter
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          isFormValid={isFormValid}
          onSubmit={onSubmit}
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
          <TextInput
            name="pinCode"
            inputMode="text"
            control={control}
            endButtonText="Check"
            autoCorrect={false}
            label="Pin Code"
            placeholder="Enter pin Code"
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
