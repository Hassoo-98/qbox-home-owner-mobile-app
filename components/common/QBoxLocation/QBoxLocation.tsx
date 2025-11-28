import { SelectField, Text, TextInput } from "@/components/ui";
import { Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { QBoxLocationProps } from "./props";

export const QBoxLocation = ({
  control,
  qboxImage,
  pickImage,
}: QBoxLocationProps) => {
  return (
    <View>
      <TextInput
        name="shortId"
        inputMode="text"
        control={control}
        endButtonText="Verify"
        autoCorrect={false}
        label="Short Address"
        placeholder="XXXXXXXXX"
      />

      {/* City */}
      <TextInput
        name="city"
        inputMode="text"
        control={control}
        autoCorrect={false}
        label="City"
        placeholder="Enter city"
      />

      {/* District */}
      <TextInput
        name="district"
        inputMode="text"
        control={control}
        autoCorrect={false}
        label="District"
        placeholder="Enter District"
      />

      {/* Street */}
      <TextInput
        name="street"
        inputMode="text"
        control={control}
        autoCorrect={false}
        label="Street"
        placeholder="Enter Street Address"
      />

      {/* Postal Code */}
      <TextInput
        name="postalCode"
        inputMode="numeric"
        control={control}
        autoCorrect={false}
        label="Postal Code"
        placeholder="XXXXX"
      />

      {/* Building Number */}
      <TextInput
        name="buildingNumber"
        inputMode="numeric"
        control={control}
        autoCorrect={false}
        label="Building Number"
        placeholder="XXXX"
      />

      {/* Secondary Number */}
      <TextInput
        name="secondaryNumber"
        inputMode="numeric"
        control={control}
        autoCorrect={false}
        label="Secondary Number"
        placeholder="XXXX"
      />

      <SelectField
        name="installationLocation"
        control={control}
        label="Preferred Installation Location"
        placeholder="Select location"
        options={[
          { label: "Main Door", value: "mainDoor" },
          { label: "Gate", value: "gate" },
          { label: "Building Entrance", value: "entrance" },
        ]}
      />

      {/* Access Instruction */}
      <TextInput
        name="accessInstruction"
        inputMode="text"
        control={control}
        label="Access Instruction"
        placeholder="Explain where you want us to install your QBox."
        multiline
        numberOfLines={4}
      />

      {/* QBox Image Upload */}
      <View style={{ marginBottom: Spacing.lg }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: Spacing.sm,
            marginBottom: mvs(Spacing.sm),
          }}
        >
          <Text size="sm" style={{ fontWeight: "500" }}>
            QBox Image
          </Text>
          <Ionicons name="information-circle-outline" size={18} color="#666" />
        </View>

        <TouchableOpacity
          onPress={pickImage}
          activeOpacity={0.7}
          style={{
            borderWidth: 1,
            borderColor: "#D1D5DB",
            borderStyle: "dashed",
            borderRadius: 8,
            padding: Spacing.md,
            backgroundColor: "#FFFFFF",
            minHeight: qboxImage ? 150 : 80,
          }}
        >
          {qboxImage ? (
            <View>
              <Image
                source={{ uri: qboxImage }}
                style={{
                  width: "100%",
                  height: 120,
                  borderRadius: 4,
                  marginBottom: Spacing.sm,
                }}
                resizeMode="cover"
              />
              <Text
                size="xs"
                variant="secondary"
                style={{ textAlign: "center" }}
              >
                Tap to change image
              </Text>
            </View>
          ) : (
            <Text
              size="xs"
              variant="secondary"
              style={{
                lineHeight: 20,
              }}
            >
              Place QBox Infront of your main door. Take the picture & upload it
              over here.
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
