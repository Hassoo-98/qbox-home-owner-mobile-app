import { BorderRadius, Colors } from "@/constants";
import { useModal } from "@/hooks";
import { useRegister, useSendOtp, useVerifyOtp } from "@/hooks/api/useAuthQueries";
import { useVerifyQBoxId } from "@/hooks/api/useQBoxQueries";
import { RegisterPayload } from "@/services/api/types";
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
  const registerMutation = useRegister();
  const sendOtpMutation = useSendOtp();
  const verifyOtpMutation = useVerifyOtp();
  const verifyQBoxMutation = useVerifyQBoxId();

  const [currentStep, setCurrentStep] = useState(1);
  const [isQBoxVerified, setIsQBoxVerified] = useState(false);

  const {
    control,
    formState: { isDirty, errors, dirtyFields },
    trigger,
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
    mode: "all", // Optimized for better UX with multi-step
  });

  const qBoxId = watch("qBoxId");

  const validateStep = async (step: number) => {
    let fieldsToValidate: (keyof SignUpFormValues)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = [
          "fullName",
          "email",
          "phone",
          "password",
          "confirmPassword",
        ];
        break;
      case 2:
        fieldsToValidate = ["qBoxId"];
        break;
      case 3:
        fieldsToValidate = [
          "shortId",
          "city",
          "district",
          "street",
          "postalCode",
          "buildingNumber",
          "installationLocation",
          "accessInstruction",
          "qboxImage",
        ];
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    return isValid;
  };

  const handleConfirm = () => {
    onCloseModal();
    router.navigate("/(auth)");
  };

  const onSubmit = handleSubmit((data: SignUpFormValues) => {

    const payload: RegisterPayload = {
      full_name: data.fullName,
      email: data.email,
      phone_number: data.phone,
      secondary_phone_number: data.secondaryPhone,
      password: data.password,
      qbox_id: data.qBoxId,
      address: {
        short_address: data.shortId,
        city: data.city,
        district: data.district,
        street: data.street,
        postal_code: data.postalCode,
        building_number: data.buildingNumber,
        secondary_building_number: data.secondaryNumber,
      },
      installation: {
        location_preference: data.installationLocation,
        access_instruction: data.accessInstruction,
        qbox_image_url: data.qboxImage,
      },
    };

    console.log(
      "signup form submission: ",
      JSON.stringify(payload, null, 4)
    );

    registerMutation.mutate(payload, {
      onSuccess: () => {
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
      }
    });
  });

  const email = watch("email");
  const phone = watch("phone");
  const contact = phone || email;
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

  const handleSendOtp = (contact: string, onSuccess?: () => void) => {
    const isEmail = contact.includes("@");
    sendOtpMutation.mutate(
      isEmail ? { email: contact } : { phone_number: contact },
      {
        onSuccess: (data: any) => {
          console.log("OTP sent successfully, response data:", data);
          onSuccess?.();
        },
      }
    );
  };

  const handleVerifyOtp = (contact: string, otp: string, onSuccess: () => void) => {
    const isEmail = contact.includes("@");
    verifyOtpMutation.mutate(
      isEmail ? { email: contact, otp } : { phone_number: contact, otp },
      {
        onSuccess: () => {
          onSuccess();
        },
      }
    );
  };

  const handleCheckQBox = () => {
    if (!qBoxId) {
      Alert.alert("Error", "Please enter QBox ID first");
      return;
    }
    verifyQBoxMutation.mutate({ qbox_id: qBoxId }, {
      onSuccess: () => {
        setIsQBoxVerified(true);
      },
      onError: () => {
        setIsQBoxVerified(false);
      }
    });
  };

  return {
    currentStep,
    setCurrentStep,
    validateStep,
    onSubmit,
    control,
    contact,
    pickImage,
    qboxImage,
    handleSendOtp,
    handleVerifyOtp,
    handleCheckQBox,
    isQBoxVerified,
    isQBoxChecking: verifyQBoxMutation.isPending,
  };
};
