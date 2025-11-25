import { SignUpFormValues } from "@/types";
import { SignUpFormResolver } from "@/utils";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";

export const useSignup=()=>{

      const [currentStep, setCurrentStep] = useState(1);
    
      const params = useLocalSearchParams();
    
      const {
        control,
        formState: { isDirty },
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
          qboxImage: "", // Added image field
        },
        mode: "onChange",
      });
    
      useEffect(() => {
        console.log("origin in signup====>", params?.origin);
        if (params?.origin === "otpVerification") {
          setCurrentStep(2);
        }
      }, [params]);
    
      const isFormValid = isDirty;
    
      const onSubmit = handleSubmit((data: SignUpFormValues) => {
        console.log(
          "signup form submission submission: ",
          JSON.stringify(data, null, 4)
        );
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

    return{
        currentStep,
        setCurrentStep,
        isFormValid,
        onSubmit,
        control,
        phoneNumber,
        pickImage,
        qboxImage
    }
}