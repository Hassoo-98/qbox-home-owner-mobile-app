import { Text, TextInput } from "@/components/ui";
import { CustomDropdown } from "@/components/ui/Dropdown";
import { Spacing } from "@/constants";
import { useLocale } from "@/hooks";
import { mvs } from "@/utils/metrices";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { PackageInformationProps } from "./props";

export const PackageInformation = ({ control, packageImage, pickImage }: PackageInformationProps) => {
  const { t } = useLocale();

  return (
    <View>
      <CustomDropdown
        name="packageType"
        control={control}
        label={t("packageType")}
        placeholder={t("packageType")}
        options={[
          { label: t("electronic"), value: "electronic" },
          { label: t("medical"), value: "medical" },
          { label: t("other"), value: "other" },
        ]}
      />
      <TextInput
        name="packageWeight"
        inputMode="numeric"
        control={control}
        autoCorrect={false}
        label={`${t("packageWeight")} (Kg)`}
        placeholder={t("enterWeight")}
      />

      <View style={{ flexDirection: "row", gap: Spacing.sm, alignItems: "center", width: "100%" }}>
        <CustomDropdown
          name="currency"
          control={control}
          label={t("currency")}
          placeholder={t("currency")}
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
          label={t("itemValue")}
          width={"50%"}
          placeholder="XXX"
        />
      </View>

      <TextInput
        name="packageDescription"
        inputMode="text"
        control={control}
        label={t("description")}
        placeholder="XXXXXXX"
        multiline
        numberOfLines={4}
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
            {t("packageImage")}
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
              <Text size="xs" variant="secondary" style={{ textAlign: "center" }}>
                {t("tapToChangeImage")}
              </Text>
            </View>
          ) : (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text size="xs" variant="secondary" style={{ lineHeight: 20 }}>
                +
              </Text>
              <Text size="xs" variant="secondary" style={{ lineHeight: 20 }}>
                {t("uploadImage")}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
