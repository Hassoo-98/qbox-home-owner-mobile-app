import { useVerifyQBoxId } from "@/hooks/api/useQBoxQueries";
import {
  usePaymentMethods,
  useSendPackageMutation,
} from "@/hooks/api/useShipmentQueries";
import { useAuth } from "@/hooks/useAuth";
import { SendPackageFormValues } from "@/types";
import { CreateShipmentRequest, VerifyQBoxResponse } from "@/services/api/types";
import { SendPackageFormResolver } from "@/utils";
import { isAxiosError } from "axios";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";

const logBackendError = (label: string, error: unknown) => {
  if (isAxiosError(error)) {
    console.error(label, {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    });
    return;
  }

  console.error(label, error);
};

const getBackendErrorMessage = (error: unknown, fallback: string) => {
  if (isAxiosError(error)) {
    const data = error.response?.data as any;
    return (
      data?.message ||
      data?.detail ||
      data?.error ||
      error.message ||
      fallback
    );
  }

  return fallback;
};

export const useSendPackage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { user } = useAuth();
  const sendPackageMutation = useSendPackageMutation();
  const verifyQBoxMutation = useVerifyQBoxId();
  const paymentMethodsQuery = usePaymentMethods();
  const [isQBoxVerified, setIsQBoxVerified] = useState(false);
  const [verifiedQBoxId, setVerifiedQBoxId] = useState("");
  const [receiverHomeOwnerId, setReceiverHomeOwnerId] = useState("");

  const {
    control,
    formState: { isDirty, errors },
    reset,
    watch,
    getValues,
    setValue,
    trigger,
    handleSubmit,
  } = useForm<SendPackageFormValues>({
    resolver: SendPackageFormResolver,
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      qBoxId: "",
      receiverHomeOwnerId: "",
      senderHomeOwnerId: "",
      serviceProviderId: "",
      packageType: "",
      packageWeight: 0,
      currency: "sar",
      packageItemValue: 0,
      packageDescription: "",
      qboxImage: "",
      shippingCompany: "",
      shippingCompanyName: "",
      paymentMethod: "",
      paymentMethodId: "",
      cardHolderName: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
      charges: 0,
    },
    mode: "onChange",
  });

  const isFormValid = isDirty;
  const qBoxId = watch("qBoxId");
  const paymentMethods = paymentMethodsQuery.data?.results ?? [];

  console.log("send package formm errors: ", JSON.stringify(errors, null, 4));

  useEffect(() => {
    if (user?.id) {
      setValue("senderHomeOwnerId", user.id, {
        shouldDirty: false,
        shouldValidate: true,
      });
    }
  }, [setValue, user?.id]);

  useEffect(() => {
    const normalizedQBoxId = qBoxId.trim();

    if (!isQBoxVerified || !verifiedQBoxId) {
      return;
    }

    if (normalizedQBoxId === verifiedQBoxId) {
      return;
    }

    setIsQBoxVerified(false);
    setVerifiedQBoxId("");
    setReceiverHomeOwnerId("");
    setValue("receiverHomeOwnerId", "", { shouldDirty: false, shouldValidate: true });
    setValue("fullName", "", { shouldDirty: false, shouldValidate: true });
    setValue("email", "", { shouldDirty: false, shouldValidate: true });
    setValue("phone", "", { shouldDirty: false, shouldValidate: true });
  }, [isQBoxVerified, qBoxId, setValue, verifiedQBoxId]);

  const verifyQBox = () => {
    const qboxIdValue = getValues("qBoxId").trim();

    if (!qboxIdValue) {
      Alert.alert("Validation Error", "Please enter your QBox ID first.");
      return;
    }

    verifyQBoxMutation.mutate(
      { qbox_id: qboxIdValue },
      {
        onSuccess: (response: VerifyQBoxResponse) => {
          const homeowner = response?.data?.homeowner;

          if (!response?.success || !homeowner) {
            Alert.alert(
              "Verification Failed",
              response?.message || "Unable to verify the provided QBox ID."
            );
            return;
          }

          setValue("qBoxId", response.data.qbox_id || qboxIdValue, {
            shouldDirty: true,
            shouldValidate: true,
          });
          setValue("fullName", homeowner.full_name || "", {
            shouldDirty: false,
            shouldValidate: true,
          });
          setValue("email", homeowner.email || "", {
            shouldDirty: false,
            shouldValidate: true,
          });
          setValue("phone", homeowner.phone_number || "", {
            shouldDirty: false,
            shouldValidate: true,
          });
          setValue("receiverHomeOwnerId", homeowner.id || "", {
            shouldDirty: false,
            shouldValidate: true,
          });

          setVerifiedQBoxId(response.data.qbox_id || qboxIdValue);
          setIsQBoxVerified(true);
          setReceiverHomeOwnerId(homeowner.id || "");
        },
        onError: (error: any) => {
          setIsQBoxVerified(false);
          setVerifiedQBoxId("");
          setReceiverHomeOwnerId("");
          setValue("receiverHomeOwnerId", "", { shouldDirty: false, shouldValidate: true });
          logBackendError("QBox verification error", error);
        },
      }
    );
  };

  const validateStep = async (step: number) => {
    if (step === 1 && !isQBoxVerified) {
      Alert.alert(
        "QBox Verification Required",
        "Please verify the QBox ID before continuing."
      );
      return false;
    }

    const fieldsByStep: Record<number, (keyof SendPackageFormValues)[]> = {
      1: [
        "fullName",
        "email",
        "phone",
        "qBoxId",
        "receiverHomeOwnerId",
        "senderHomeOwnerId",
      ],
      2: [
        "packageType",
        "packageWeight",
        "currency",
        "packageItemValue",
        "packageDescription",
        "qboxImage",
      ],
      3: [
        "senderHomeOwnerId",
        "receiverHomeOwnerId",
        "shippingCompany",
        "shippingCompanyName",
        "serviceProviderId",
        "paymentMethod",
        "paymentMethodId",
        "cardHolderName",
        "cardNumber",
        "expiry",
        "cvv",
        "charges",
      ],
    };

    const fieldsToValidate = fieldsByStep[step] ?? [];
    if (!fieldsToValidate.length) {
      return true;
    }

    return trigger(fieldsToValidate as any);
  };


  const onSubmit = handleSubmit((data: SendPackageFormValues) => {
    const payload: CreateShipmentRequest = {
      serviceProviderId: data.serviceProviderId,
      receiverHomeOwnerId: data.receiverHomeOwnerId || receiverHomeOwnerId,
      senderHomeOwnerId: data.senderHomeOwnerId || user?.id || "",
      packageImage: data.qboxImage,
      shipmentCategory: data.shippingCompanyName || data.shippingCompany,
      description: data.packageDescription,
      qBoxId: data.qBoxId,
      shipment_type: "H2H",
      shipmentType: "H2H",
      paymentMethodId: data.paymentMethodId,
      cardDetails:
        /credit\/debit card/i.test(data.paymentMethod || "")
          ? {
              cardholderName: data.cardHolderName,
              cardNumber: data.cardNumber,
              expiry: data.expiry,
              cvv: data.cvv,
            }
          : null,
      attributes: [
        {
          type: "Shipment Type",
          value: data.packageType,
        },
        {
          type: "Shipment Weight",
          value: `${Number(data.packageWeight).toFixed(1)} kg`,
        },
        {
          type: "Item Value",
          value: `${Number(data.packageItemValue).toFixed(0)} ${String(
            data.currency
          ).toUpperCase()}`,
        },
        {
          type: "Currency",
          value: String(data.currency).toUpperCase(),
        },
      ],
    };

    console.log("send package payload: ", JSON.stringify(payload, null, 4));

    sendPackageMutation.mutate(payload, {
    onSuccess: () => {
        Alert.alert("Success", "Package sent successfully!");
        reset();
        setIsQBoxVerified(false);
        setVerifiedQBoxId("");
        setReceiverHomeOwnerId("");
        setCurrentStep(1);
        router.navigate("/(app)/(package)");
      },
      onError: (error) => {
        Alert.alert(
          "Error",
          getBackendErrorMessage(
            error,
            "Failed to send package. Please try again."
          )
        );
        logBackendError("sendPackage mutation error", error);
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
    setValue,
    phoneNumber,
    pickImage,
    qboxImage,
    verifyQBox,
    isQBoxVerified,
    isVerifyingQBox: verifyQBoxMutation.isPending,
    paymentMethods: paymentMethods.filter((method) => method.is_active),
    validateStep,
    isPending: sendPackageMutation.isPending,
  };
};
