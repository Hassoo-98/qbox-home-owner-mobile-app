import { ReturnPackageFormValues } from "@/types";
import { ReturnPackageFormResolver } from "@/utils";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";

export const useReturnPackage = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const {
    control,
    formState: { isDirty, errors },
    reset,
    watch,
    setValue,
    handleSubmit,
  } = useForm<ReturnPackageFormValues>({
    resolver: ReturnPackageFormResolver,
    defaultValues: {
      pinCode: "",
      packageType: "",
      packageWeight: 0,
      currency: "",
      packageItemValue: 0,
      packageDescription: "",
      returnPackageImage: "",
    },
    mode: "onChange",
  });

  const isFormValid = isDirty;

  console.log("send package formm errors: ", JSON.stringify(errors, null, 4));

  const onSubmit = handleSubmit((data: ReturnPackageFormValues) => {
    console.log(
      "sendPackage submission submission: ",
      JSON.stringify(data, null, 4)
    );
    reset();
    router.navigate("/(app)/(package)");
  });

  const returnPackageImage = watch("returnPackageImage");

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera roll permissions to upload images."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setValue("returnPackageImage", result.assets[0].uri, {
          shouldDirty: true,
        });
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  return {
    currentStep,
    setCurrentStep,
    isFormValid,
    onSubmit,
    control,
    pickImage,
    returnPackageImage,
  };
};
