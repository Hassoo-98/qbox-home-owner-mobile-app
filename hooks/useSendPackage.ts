import { useSendPackageMutation } from "@/hooks/api/useShipmentQueries";
import { SendPackageFormValues } from "@/types";
import { SendPackageFormResolver } from "@/utils";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";

export const useSendPackage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const sendPackageMutation = useSendPackageMutation();

  const {
    control,
    formState: { isDirty, errors },
    reset,
    watch,
    setValue,
    handleSubmit,
  } = useForm<SendPackageFormValues>({
    resolver: SendPackageFormResolver,
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      qBoxId: "",
      packageType: "",
      packageWeight: 0,
      currency: "sar",
      packageItemValue: 0,
      packageDescription: "",
      qboxImage: "",
      shippingCompany: "",
    },
    mode: "onChange",
  });

  const isFormValid = isDirty;

  console.log("send package formm errors: ", JSON.stringify(errors, null, 4));

  const onSubmit = handleSubmit((data: SendPackageFormValues) => {
    sendPackageMutation.mutate(data, {
      onSuccess: () => {
        Alert.alert("Success", "Package sent successfully!");
        reset();
        router.navigate("/(app)/(package)");
      },
      onError: (error) => {
        Alert.alert("Error", "Failed to send package. Please try again.");
        console.error("sendPackage mutation error: ", error);
      },
    });
  });

  const phoneNumber = watch("phone");
  const qboxImage = watch("qboxImage");

  // Request permissions and pick image
  const pickImage = async () => {
    try {
      // Request permission
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera roll permissions to upload images."
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        // Set the image base64 to form
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setValue("qboxImage", base64Image, { shouldDirty: true });
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
    phoneNumber,
    pickImage,
    qboxImage,
    isPending: sendPackageMutation.isPending,
  };
};
