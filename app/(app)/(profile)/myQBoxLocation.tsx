import { WarningIconOutline } from "@/assets/icons";
import { QBoxLocation, Text } from "@/components";
import { BorderRadius, Colors, Spacing } from "@/constants";
import { useModal } from "@/hooks";
import { useProfile } from "@/hooks/useProfile";
import { QBoxLocationFormFormValues } from "@/types";
import { MyQBoxLocationResolver } from "@/utils";
import { mvs } from "@/utils/metrices";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";

import { useUpdateHomeOwner } from "@/hooks/api/useHomeOwnerQueries";
import { useHomeOwner } from "@/hooks/useHomeOwner";

export const MyQBoxLocation = () => {
  const { setOnSave } = useProfile();
  const { data: homeOwnerResponse } = useHomeOwner();
  const homeOwner = homeOwnerResponse?.data;
  const { mutateAsync: updateHomeOwner } = useUpdateHomeOwner(homeOwner?.id || "");

  const { onTriggerModal, onCloseModal } = useModal();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<QBoxLocationFormFormValues>({
    defaultValues: {},
    resolver: MyQBoxLocationResolver,
    mode: "onChange",
  });

  useEffect(() => {
    if (homeOwner) {
      reset({
        shortId: homeOwner.address?.short_address || "",
        city: homeOwner.address?.city || "",
        district: homeOwner.address?.district || "",
        street: homeOwner.address?.street || "",
        postalCode: homeOwner.address?.postal_code || "",
        buildingNumber: homeOwner.address?.building_number || "",
        secondaryNumber: homeOwner.address?.secondary_building_number || "",
        installationLocation: homeOwner.installation_location_preference || "",
        accessInstruction: homeOwner.installation_access_instruction || "",
        qboxImage: homeOwner.installation_qbox_image_url || "",
      });
    }
  }, [homeOwner, reset]);

  const qboxImage = watch("qboxImage");

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

  console.log("form errros: ", errors);

  const submitHandler = useCallback(async (data: QBoxLocationFormFormValues) => {
    try {
      await updateHomeOwner({
        full_name: homeOwner?.full_name || "",
        email: homeOwner?.email || "",
        address: {
          short_address: data.shortId,
          city: data.city,
          district: data.district,
          street: data.street,
          postal_code: data.postalCode,
          building_number: data.buildingNumber,
          secondary_building_number: data.secondaryNumber,
        },
        installation_location_preference: data.installationLocation,
        installation_access_instruction: data.accessInstruction,
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
        title: "Your location change request has been submitted for approval.",
        primaryButtonText: "Confirm",
        primaryButtonHandler: () => {
          onCloseModal();
          router.dismiss();
        },
        subtitle: "Once approved, our team will contact you within 24 hours .",
      });
    } catch (error: any) {
      console.error("Location update failed:", error);
      Alert.alert("Error", error?.response?.data?.message || "Failed to update location.");
    }
  }, [updateHomeOwner, homeOwner, onTriggerModal, onCloseModal, router]);

  const onSaveLocation = useMemo(() => handleSubmit(submitHandler), [handleSubmit, submitHandler]);

  useEffect(() => {
    setOnSave(() => onSaveLocation);

    return () => setOnSave(null);
  }, [setOnSave, onSaveLocation]);

  return (
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
                Short Address change requests require admin approval. Your
                account will stay offline until approved.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MyQBoxLocation;
