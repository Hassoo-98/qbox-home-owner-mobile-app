import { BorderRadius, Colors } from "@/constants";
import { useModal } from "@/hooks";
import { SignUpFormValues } from "@/types";
import { SignUpFormResolver } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, View } from "react-native";

export const useSignup = () => {
  const { onTriggerModal, onCloseModal } = useModal();

  const [currentStep, setCurrentStep] = useState(1);

  const {
    control,
    formState: { isDirty, errors, dirtyFields },
    reset,
    watch,
    setValue,
    handleSubmit,
  } = useForm<SignUpFormValues>({
    resolver: SignUpFormResolver,
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      secondaryPhone: "",
      password: "",
      confirmPassword: "",
      qBoxId: "",
      shortId: "",
      city: "",
      district: "",
      street: "",
      postalCode: "",
      buildingNumber: "",
      secondaryNumber: "",
      installationLocation: "",
      accessInstruction: "",
      qboxImage: "",
    },
    mode: "all",
  });

  const isFormValid = isDirty;

  const isFirstStepFormValid = !!(
    dirtyFields.fullName &&
    dirtyFields.email &&
    dirtyFields.phone &&
    dirtyFields.secondaryPhone &&
    dirtyFields.password &&
    dirtyFields.confirmPassword
  );

  const isSecondStepFormValid = !!dirtyFields.qBoxId;

  const isLastStepFormValid = !!(
    dirtyFields.shortId &&
    dirtyFields.city &&
    dirtyFields.district &&
    dirtyFields.street &&
    dirtyFields.postalCode &&
    dirtyFields.buildingNumber &&
    dirtyFields.installationLocation &&
    dirtyFields.accessInstruction &&
    dirtyFields.buildingNumber
  );

  const handleConfirm = () => {
    onCloseModal();
    router.navigate("/(auth)");
  };

  const onSubmit = handleSubmit((data: SignUpFormValues) => {
    console.log(
      "signup form submission submission: ",
      JSON.stringify(data, null, 4)
    );
    onTriggerModal({
      icon: (
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: BorderRadius.full,
            backgroundColor: Colors.success,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <Ionicons size={22} name="checkmark-sharp" color={Colors.white} />
        </View>
      ),
      title: "Your request has been submitted for approval.",
      primaryButtonText: "Confirm",
      primaryButtonHandler: handleConfirm,
      secondaryButtonHandler: onCloseModal,
      subtitle: "Once approved, we’ll send you confirmation email.",
    });
    reset();
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
      });

      if (!result.canceled && result.assets[0]) {
        // Set the image URI to form
        setValue("qboxImage", result.assets[0].uri, { shouldDirty: true });
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
    isFirstStepFormValid,
    isSecondStepFormValid,
    isLastStepFormValid,
    onSubmit,
    control,
    phoneNumber,
    pickImage,
    qboxImage,
  };
};
