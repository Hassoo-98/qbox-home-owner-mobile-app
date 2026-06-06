import { Text, TextInput } from "@/components/ui";
import { CustomDropdown } from "@/components/ui/Dropdown";
import { Spacing } from "@/constants";
import { useLocale } from "@/hooks";
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
  getValues,
  handleCheckShortAddress,
  isShortAddressVerified,
  isShortAddressChecking,
  readonlyFields = false,
  installationEditable = true,
  accessInstructionEditable = true,
}: QBoxLocationProps) => {
  const { t } = useLocale();

  return (
    <View>
      <TextInput
        name="shortId"
        inputMode="text"
        control={control}
        endButtonText={isShortAddressVerified ? t("verified") : t("verify")}
        onEndButtonClick={() => handleCheckShortAddress(getValues("shortId"))}
        endButtonProps={{
          disabled: isShortAddressVerified || isShortAddressChecking,
          loading: isShortAddressChecking,
          variant: isShortAddressVerified ? "success" : "primary",
        }}
        autoCorrect={false}
        label={t("shortAddress")}
        placeholder="XXXXXXXXX"
      />

      <TextInput
        name="city"
        inputMode="text"
        control={control}
        autoCorrect={false}
        label={t("cityOptional")}
        placeholder={t("cityOptional")}
        editable={!readonlyFields}
      />

      <TextInput
        name="district"
        inputMode="text"
        control={control}
        autoCorrect={false}
        label={t("districtOptional")}
        placeholder={t("districtOptional")}
        editable={!readonlyFields}
      />

      <TextInput
        name="street"
        inputMode="text"
        control={control}
        autoCorrect={false}
        label={t("streetOptional")}
        placeholder={t("streetOptional")}
        editable={!readonlyFields}
      />

      <TextInput
        name="postalCode"
        inputMode="numeric"
        control={control}
        autoCorrect={false}
        label={t("postalCodeOptional")}
        placeholder="XXXXX"
        editable={!readonlyFields}
      />

      <TextInput
        name="buildingNumber"
        inputMode="numeric"
        control={control}
        autoCorrect={false}
        label={t("buildingNumberOptional")}
        placeholder="XXXX"
        editable={!readonlyFields}
      />

      <TextInput
        name="secondaryNumber"
        inputMode="numeric"
        control={control}
        autoCorrect={false}
        label={t("secondaryNumberOptional")}
        placeholder="XXXX"
        editable={!readonlyFields}
      />

      <CustomDropdown
        name="installationLocation"
        control={control}
        label={t("preferredInstallationLocation")}
        placeholder={t("selectLocation")}
        disabled={!installationEditable}
        options={[
          { label: t("mainDoor"), value: "mainDoor" },
          { label: t("gate"), value: "gate" },
          { label: t("buildingEntrance"), value: "entrance" },
        ]}
      />

      <TextInput
        name="accessInstruction"
        inputMode="text"
        control={control}
        label={t("accessInstruction")}
        placeholder={t("placeQBoxInFront")}
        multiline
        numberOfLines={4}
        editable={accessInstructionEditable}
      />

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
            {t("qboxImage")}
          </Text>
          <Ionicons name="information-circle-outline" size={18} color="#666" />
        </View>

        <TouchableOpacity
          onPress={readonlyFields ? undefined : pickImage}
          activeOpacity={0.7}
          style={{
            borderWidth: 1,
            borderColor: "#D1D5DB",
            borderStyle: "dashed",
            borderRadius: 8,
            padding: Spacing.md,
            backgroundColor: "#FFFFFF",
            minHeight: qboxImage ? 150 : 80,
            opacity: readonlyFields ? 0.75 : 1,
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
              <Text size="xs" variant="secondary" style={{ textAlign: "center" }}>
                {t("tapToChangeImage")}
              </Text>
            </View>
          ) : (
            <Text size="xs" variant="secondary" style={{ lineHeight: 20 }}>
              {t("placeQBoxInFront")}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
