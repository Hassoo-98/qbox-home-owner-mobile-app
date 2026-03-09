import { Colors } from "@/constants";
import { ReturnPackageFormValues } from "@/types";
import { ReturnPackageFormResolver } from "@/utils";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";
import { Toast } from "toastify-react-native";
import { useReturnPackageMutation } from "./api/useShipmentQueries";

export const useReturnPackage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const returnPackageMutation = useReturnPackageMutation();

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
    const payload = {
      returnPackageImage: data.returnPackageImage,
      packageDescription: data.packageDescription,
      qBoxId: "QBOX-01", // Defaulted per API payload req
      pinCode: data.pinCode,
      attributes: [
        { type: "Package Type", value: data.packageType },
        { type: "Package Weight", value: Number(data.packageWeight).toFixed(2) },
        { type: "Item Value", value: Number(data.packageItemValue).toFixed(2) },
        { type: "currency", value: data.currency },
      ],
    };

    returnPackageMutation.mutate(payload, {
      onSuccess: () => {
        reset();
        router.navigate("/(app)/(package)");
        Toast.show({
          type: "success",
          text1: "Package returned successfully.",
          position: "top",
          backgroundColor: Colors.white,
          textColor: Colors.text,
          progressBarColor: Colors.white,
          visibilityTime: 3000,
        });
      },
      onError: (error) => {
        console.error("Return package error:", error);
        Alert.alert("Error", "Failed to return package. Please try again.");
      },
    });
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
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setValue("returnPackageImage", base64Image, {
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
    isPending: returnPackageMutation.isPending,
  };
};
