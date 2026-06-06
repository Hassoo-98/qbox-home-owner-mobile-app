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
import { Toast } from "toastify-react-native";
import { useVerifyShortAddress } from "./api/useShortAddressQueries";

export const useSignup = () => {
  const { onTriggerModal, onCloseModal } = useModal();
  const registerMutation = useRegister();
  const sendOtpMutation = useSendOtp();
  const verifyOtpMutation = useVerifyOtp();
  const verifyQBoxMutation = useVerifyQBoxId();




  const [currentStep, setCurrentStep] = useState(1);
  const [isQBoxVerified, setIsQBoxVerified] = useState(false);
  const [isShortAddressVerified, setIsShortAddressVerified] = useState(false);

  const {
    control,
    formState: { isDirty, errors, dirtyFields },
    trigger,
    reset,
    watch,
    setValue,
    handleSubmit,
    getValues,
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

  // Initialize the verifyShortAddressMutation with onSuccess callback for auto-fill
  const verifyShortAddressMutation = useVerifyShortAddress({
    onSuccess: (response: any) => {
      setIsShortAddressVerified(true);
      // Auto-fill address fields from the verified short address data
      const data = response?.data;
      console.log("Short address verification response:", JSON.stringify(response, null, 2));
      console.log("Extracted data:", JSON.stringify(data, null, 2));
      if (data) {
        setValue("city", data.city || "", { shouldDirty: true, shouldValidate: true });
        setValue("district", data.district || "", { shouldDirty: true, shouldValidate: true });
        setValue("street", data.street || "", { shouldDirty: true, shouldValidate: true });
        setValue("postalCode", data.postal_code || "", { shouldDirty: true, shouldValidate: true });
        setValue("buildingNumber", data.building_number || "", { shouldDirty: true, shouldValidate: true });
        setValue("secondaryNumber", data.additional_number || "", { shouldDirty: true, shouldValidate: true });
      }
    },
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
          "secondaryPhone",
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
        additional_number: data.secondaryNumber,
      },
      installation: {
        location_preference: data.installationLocation,
        access_instruction: data.accessInstruction,
        qbox_image_url: data.qboxImage, // This will now be the base64 string
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
  const contact = email;
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


  const handleCheckShortAddress = (short_address: string) => {
    if (!short_address) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter QBox Short Address first",
        position: "top",
        backgroundColor: Colors.white,
        textColor: Colors.text,
        progressBarColor: Colors.danger,
        visibilityTime: 3000,
      });
      return;
    }
    verifyShortAddressMutation.mutate({ short_address: short_address }, {
      onError: () => {
        setIsShortAddressVerified(false);
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
    handleCheckShortAddress,
    isShortAddressVerified,
    isShortAddressChecking: verifyShortAddressMutation.isPending,
    getValues,
  };
};
