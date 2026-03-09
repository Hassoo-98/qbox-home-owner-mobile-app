import {
  FormLayout,
  PackageInformation,
  ReturnPackageFooter,
  TextInput,
} from "@/components";
import { useReturnPackage } from "@/hooks";
import { View } from "react-native";
import { styles } from "./form.styles";

export const ReturnPackage = () => {
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
      title={"Package Infromation"}
      description={"Enter the infromation bellow."}
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
