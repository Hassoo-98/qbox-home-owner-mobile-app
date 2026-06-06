import { Button, Card, SelectField, Text, TextInput } from "@/components";
import { Colors, QR_VALIDITY_DURATION_TYPE, Spacing } from "@/constants";
import { useLocale } from "@/hooks";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { QRGenerationFormProps } from "./props";

export const QRGenerationForm = ({
  control,
  isGenerating,
  onGenerateQR,
  isQrCodeGenerated,
  resetForm,
  maxUsers,
  validityDuration,
  validityDurationType,
  qrCodeImage,
  qrCodeName,
  onCopyQrCode,
}: QRGenerationFormProps) => {
  const { t } = useLocale();

  const getDisplayText = () => {
    if (isGenerating) {
      return t("generatingQrCode");
    }

    if (
      !(maxUsers && validityDuration && validityDurationType) ||
      parseInt(maxUsers) === 0 ||
      parseInt(validityDuration) === 0
    ) {
      return t("generateAccessQRCode");
    }

    const unit =
      validityDurationType === QR_VALIDITY_DURATION_TYPE.MIN
        ? t("minute")
        : validityDurationType === QR_VALIDITY_DURATION_TYPE.HOUR
          ? t("hour")
          : t("day");

    return `${t("validFor")} ${maxUsers} ${t("users")}, ${t("expiresIn")} ${validityDuration} ${unit}${
      parseInt(validityDuration) > 1 ? "s" : ""
    }`;
  };

  return (
    <Card backgroundColor={Colors.white} variant="filled" borderRadius={Spacing.sm}>
      <Text style={{ paddingBottom: Spacing.md, fontWeight: "bold" }}>{t("qrSetting")}</Text>
      <TextInput
        control={control}
        name="qrName"
        placeholder={t("qrNameOptional")}
        label={t("qrNameOptional")}
        editable={!isGenerating}
      />
      <SelectField
        name="maxUsers"
        label={t("maximumUsers")}
        placeholder={t("maximumUsers")}
        control={control}
        options={Array.from({ length: 10 }, (_, index) => ({
          value: (index + 1).toString(),
          label: (index + 1).toString(),
        }))}
        testID="no-of-users-select"
        accessibilityLabel="Select max users"
        disabled={isGenerating}
      />
      <View style={{ flexDirection: "column", gap: Spacing.sm }}>
        <Text size="sm">{t("validDuration")}</Text>
        <View style={{ flexDirection: "row", gap: Spacing.sm, alignItems: "center", width: "100%" }}>
          <TextInput
            control={control}
            name="validityDuration"
            placeholder={t("validDuration")}
            required={true}
            keyboardType="number-pad"
            width={"70%"}
            editable={!isGenerating}
          />
          <SelectField
            name="validityDurationType"
            control={control}
            style={{ width: "30%" }}
            options={[
              { value: QR_VALIDITY_DURATION_TYPE.MIN, label: t("minute") },
              { value: QR_VALIDITY_DURATION_TYPE.HOUR, label: t("hour") },
              { value: QR_VALIDITY_DURATION_TYPE.DAY, label: t("day") },
            ]}
            testID="validity-unit"
            accessibilityLabel="Select validity unit"
            disabled={isGenerating}
          />
        </View>
      </View>
      <Card
        backgroundColor={Colors.darkGray}
        variant="filled"
        borderRadius={Spacing.sm}
        style={{
          marginBottom: Spacing.md,
          justifyContent: "center",
        }}
        contentStyle={{
          paddingVertical: Spacing.xs,
          paddingBottom: Spacing.md,
        }}
      >
        {isQrCodeGenerated && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text size="sm" style={{ fontWeight: "bold" }}>
              {qrCodeName || t("qrCode")}
            </Text>
            <TouchableOpacity
              style={{
                padding: Spacing.sm,
                backgroundColor: Colors.gray,
                borderRadius: Spacing.sm,
              }}
              onPress={resetForm}
            >
              <Ionicons name="refresh-outline" size={20} color="black" />
            </TouchableOpacity>
          </View>
        )}
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: Spacing.lg,
          }}
        >
          {isQrCodeGenerated ? (
            qrCodeImage ? (
              <Image source={{ uri: qrCodeImage }} style={{ width: 180, height: 180 }} contentFit="contain" />
            ) : (
              <ActivityIndicator size="large" color={Colors.primary} />
            )
          ) : isGenerating ? (
            <ActivityIndicator size="large" color={Colors.primary} />
          ) : (
            <Text size="sm" variant="secondary">
              {t("qrPreviewWillAppearHere")}
            </Text>
          )}
        </View>
        <Text style={{ textAlign: "center" }}>{getDisplayText()}</Text>
      </Card>
      <Button
        variant="primary"
        icon={isQrCodeGenerated && <Ionicons name="share-social-outline" size={24} color="white" />}
        title={
          isQrCodeGenerated ? t("shareUrl") : isGenerating ? t("generatingQrCode") : t("generateAccessQRCode")
        }
        onPress={isQrCodeGenerated ? onCopyQrCode : onGenerateQR}
        disabled={isGenerating}
      />
    </Card>
  );
};
