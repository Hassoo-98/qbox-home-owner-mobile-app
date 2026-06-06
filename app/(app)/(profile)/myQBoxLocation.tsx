import { WarningIconOutline } from "@/assets/icons";
import { QBoxLocation, Text } from "@/components";
import { BorderRadius, Colors, Spacing } from "@/constants";
import { useAuth, useLocale, useModal, useProfile } from "@/hooks";
import {
  useCreateRelocationRequest,
  useRelocationStatus,
} from "@/hooks/api/useRelocationQueries";
import { useVerifyShortAddress } from "@/hooks/api/useShortAddressQueries";
import { useHomeOwner } from "@/hooks/useHomeOwner";
import { QBoxLocationFormFormValues } from "@/types";
import { MyQBoxLocationResolver } from "@/utils";
import { mvs } from "@/utils/metrices";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { Toast } from "toastify-react-native";

const extractErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === "object" && error !== null) {
    const maybeError = error as {
      response?: { data?: { message?: string; detail?: string } };
      message?: string;
    };

    return (
      maybeError.response?.data?.message ||
      maybeError.response?.data?.detail ||
      maybeError.message ||
      fallback
    );
  }

  return fallback;
};

export const MyQBoxLocation = () => {
  const { t } = useLocale();
  const { setOnSave, setIsSaving } = useProfile();
  const { user } = useAuth();
  const { data: homeOwnerResponse } = useHomeOwner();
  const homeOwner = homeOwnerResponse?.data;
  const homeOwnerId = user?.id || homeOwner?.id || "";
  const qboxId = user?.qboxes?.[0]?.qbox_id || homeOwner?.qboxes?.[0]?.qbox_id || "";

  const relocationMutation = useCreateRelocationRequest();
  const relocationStatusQuery = useRelocationStatus(homeOwnerId);
  const { onTriggerModal, onCloseModal } = useModal();

  const [isShortAddressVerified, setIsShortAddressVerified] = useState(false);
  const originalShortAddressRef = useRef("");
  const verifiedShortAddressRef = useRef("");
  const pendingModalShownRef = useRef(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    getValues,
  } = useForm<QBoxLocationFormFormValues>({
    defaultValues: {
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
    resolver: MyQBoxLocationResolver,
    mode: "onChange",
  });

  const verifyShortAddressMutation = useVerifyShortAddress({
    onSuccess: (response) => {
      const currentShortAddress = String(getValues("shortId") || "").trim();
      verifiedShortAddressRef.current = currentShortAddress;
      setIsShortAddressVerified(true);

      const data = response?.data;
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

  const hasPendingRelocationRequest = useMemo(() => {
    const relocationStatus = relocationStatusQuery.data?.data;
    if (!relocationStatus) return false;

    const latestStatus = String(relocationStatus.latest_status || "").toLowerCase();
    const pendingStatus = String(relocationStatus.pending_status || "").toLowerCase();

    return (
      relocationStatus.has_pending_request ||
      latestStatus === "pending" ||
      pendingStatus === "pending"
    );
  }, [relocationStatusQuery.data]);

  const handleCheckShortAddress = (shortAddress: string) => {
    const nextShortAddress = shortAddress.trim();
    if (!nextShortAddress) {
      Alert.alert(t("error"), "Please enter a short address.");
      return;
    }

    verifyShortAddressMutation.mutate(
      { short_address: nextShortAddress },
      {
        onError: () => {
          verifiedShortAddressRef.current = "";
          setIsShortAddressVerified(false);
        },
      }
    );
  };

  useEffect(() => {
    if (!homeOwner) return;

    reset({
      shortId: homeOwner.address?.short_address || "",
      city: homeOwner.address?.city || "",
      district: homeOwner.address?.district || "",
      street: homeOwner.address?.street || "",
      postalCode: homeOwner.address?.postal_code || "",
      buildingNumber: homeOwner.address?.building_number || "",
      secondaryNumber: homeOwner.address?.additional_number || "",
      installationLocation: homeOwner.installation?.location_preference || "",
      accessInstruction: homeOwner.installation?.access_instruction || "",
      qboxImage: homeOwner.installation?.qbox_image_url || "",
    });

    originalShortAddressRef.current = homeOwner.address?.short_address || "";
    verifiedShortAddressRef.current = homeOwner.address?.short_address || "";
    setIsShortAddressVerified(Boolean(homeOwner.address?.short_address));
  }, [homeOwner, reset]);

  useEffect(() => {
    if (relocationStatusQuery.isLoading || !homeOwnerId) return;

    if (hasPendingRelocationRequest && !pendingModalShownRef.current) {
      pendingModalShownRef.current = true;
      onTriggerModal({
        title:
          "You already have a pending relocation request. Please wait for approval before creating another one.",
        primaryButtonText: "Close",
        primaryButtonHandler: () => {
          onCloseModal();
          router.dismiss();
        },
      });
      return;
    }

    if (!hasPendingRelocationRequest) {
      pendingModalShownRef.current = false;
    }
  }, [
    hasPendingRelocationRequest,
    homeOwnerId,
    onCloseModal,
    onTriggerModal,
    relocationStatusQuery.isLoading,
  ]);

  const qboxImage = watch("qboxImage");
  const shortId = watch("shortId");

  useEffect(() => {
    const currentShortAddress = String(shortId || "").trim();
    if (!currentShortAddress) {
      setIsShortAddressVerified(false);
      return;
    }

    setIsShortAddressVerified(
      currentShortAddress === verifiedShortAddressRef.current.trim()
    );
  }, [shortId]);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          t("error"),
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
        setValue("qboxImage", result.assets[0].uri, { shouldDirty: true });
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert(t("error"), t("failedToUpdateProfile"));
    }
  };

  const submitHandler = useCallback(
    async (data: QBoxLocationFormFormValues) => {
      const nextShortAddress = String(data.shortId || "").trim();
      const previousShortAddress = originalShortAddressRef.current.trim();
      const verifiedShortAddress = verifiedShortAddressRef.current.trim();

      if (!homeOwnerId || !qboxId) {
        Alert.alert(t("error"), t("qboxNotFound"));
        return;
      }

      if (!nextShortAddress) {
        Alert.alert(t("error"), "Please enter a short address.");
        return;
      }

      if (nextShortAddress === previousShortAddress) {
        Alert.alert(t("error"), "Please enter different shortadress");
        return;
      }

      if (!isShortAddressVerified || nextShortAddress !== verifiedShortAddress) {
        Alert.alert(
          t("error"),
          "Please verify the new short address before saving."
        );
        return;
      }

      const locationPreference = String(data.installationLocation || "").trim();
      const accessInstruction = String(data.accessInstruction || "").trim();

      if (!locationPreference) {
        Alert.alert(t("error"), "Please select a preferred installation location.");
        return;
      }

      if (!accessInstruction) {
        Alert.alert(t("error"), "Please enter access instructions.");
        return;
      }

      try {
        setIsSaving(true);
        await relocationMutation.mutateAsync({
          home_owner_id: homeOwnerId,
          qbox_id: qboxId,
          new_short_address: nextShortAddress,
          installation: {
            location_preference: locationPreference,
            access_instruction: accessInstruction,
          },
        });

        originalShortAddressRef.current = nextShortAddress;
        verifiedShortAddressRef.current = nextShortAddress;
        setIsShortAddressVerified(true);

        Toast.show({
          type: "success",
          text1: "Relocation request submitted successfully.",
          position: "top",
          backgroundColor: Colors.white,
          textColor: Colors.text,
          progressBarColor: Colors.success,
          visibilityTime: 3000,
        });

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
          title: "Your relocation request has been submitted for approval.",
          primaryButtonText: "Confirm",
          primaryButtonHandler: () => {
            onCloseModal();
            router.dismiss();
          },
          subtitle: "Once approved, our team will contact you within 24 hours.",
        });
      } catch (error: unknown) {
        console.error("Relocation request failed:", error);
        Alert.alert(
          t("error"),
          extractErrorMessage(error, "Failed to submit relocation request.")
        );
      } finally {
        setIsSaving(false);
      }
    },
    [
      homeOwnerId,
      isShortAddressVerified,
      onCloseModal,
      onTriggerModal,
      qboxId,
      relocationMutation,
      setIsSaving,
      t,
    ]
  );

  const onSaveLocation = useMemo(
    () => handleSubmit(submitHandler),
    [handleSubmit, submitHandler]
  );
  const shouldBlockForm =
    relocationStatusQuery.isLoading || !homeOwner || hasPendingRelocationRequest;

  useEffect(() => {
    setOnSave(() => onSaveLocation);
    return () => setOnSave(null);
  }, [onSaveLocation, setOnSave]);

  return shouldBlockForm ? (
    <View style={{ flex: 1, backgroundColor: Colors.white }} />
  ) : (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, padding: mvs(20) }}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          <QBoxLocation
            control={control}
            pickImage={pickImage}
            qboxImage={qboxImage}
            getValues={getValues}
            handleCheckShortAddress={handleCheckShortAddress}
            isShortAddressVerified={isShortAddressVerified}
            isShortAddressChecking={verifyShortAddressMutation.isPending}
            readonlyFields
            installationEditable
            accessInstructionEditable
          />

          <View
            style={{
              backgroundColor: Colors.warning,
              paddingVertical: Spacing.md,
              paddingHorizontal: Spacing.lg,
              borderRadius: Spacing.sm,
              flexDirection: "row",
              gap: Spacing.sm,
              alignItems: "flex-start",
              marginTop: Spacing.md,
            }}
          >
            <WarningIconOutline width={20} height={20} />
            <View style={{ flex: 1, flexShrink: 1 }}>
              <Text
                size="sm"
                variant="warning"
                style={{ fontWeight: "bold" }}
                numberOfLines={undefined}
              >
                Note
              </Text>
              <Text size="sm" variant="warning" numberOfLines={undefined}>
                Relocation requests require approval. Your profile will stay unchanged until the request is approved.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MyQBoxLocation;
