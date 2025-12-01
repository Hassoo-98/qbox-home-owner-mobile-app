import { SelectField, Text, TextInput } from "@/components/ui";
import { Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { PackageInformationProps } from "./props";

export const PackageInformation = ({
  control,
  packageImage,
  pickImage,
}: PackageInformationProps) => {
  return (
    <View>
      <SelectField
        name="packageType"
        control={control}
        label="Package Type"
        placeholder="Choose package type"
        options={[
          { label: "Main Door", value: "mainDoor" },
          { label: "Gate", value: "gate" },
          { label: "Building Entrance", value: "entrance" },
        ]}
      />
      <TextInput
        name="packageWeight"
        inputMode="numeric"
        control={control}
        autoCorrect={false}
        label="Package Weight (Kg)"
        placeholder="Enter Weight"
      />

      <View
        style={{
          flexDirection: "row",
          gap: Spacing.sm,
          alignItems: "center",
          width: "100%",
        }}
      >
        <SelectField
          name="currency"
          control={control}
          label="Currency"
          placeholder="Select currency"
          containerStyle={{ width: "50%" }}
          options={[
            { label: "SAR", value: "sar" },
            { label: "INR", value: "inr" },
            { label: "RS", value: "rs" },
          ]}
        />

        <TextInput
          name="packageItemValue"
          inputMode="numeric"
          control={control}
          autoCorrect={false}
          label="Item Value"
          width={"50%"}
          placeholder="XXX"
        />
      </View>

      <TextInput
        name="packageDescription"
        inputMode="text"
        control={control}
        label="Description"
        placeholder="XXXXXXX"
        multiline
        numberOfLines={4}
      />

      {/* Package Image Upload */}
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
            Package Image
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
            minHeight: packageImage ? 150 : 80,
          }}
        >
          {packageImage ? (
            <View>
              <Image
                source={{ uri: packageImage }}
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
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text
                size="xs"
                variant="secondary"
                style={{
                  lineHeight: 20,
                }}
              >
                +
              </Text>
              <Text
                size="xs"
                variant="secondary"
                style={{
                  lineHeight: 20,
                }}
              >
                Upload image
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
