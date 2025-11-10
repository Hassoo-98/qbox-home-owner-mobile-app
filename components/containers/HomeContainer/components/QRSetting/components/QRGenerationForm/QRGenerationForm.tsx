import { DummyQRCodeIcon, PlaceholderQRIcon } from "@/assets/icons";
import { Button, Card, SelectField, Text, TextInput } from "@/components";
import { Colors, QR_VALIDITY_DURATION_TYPE, Spacing } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
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
}: QRGenerationFormProps) => {
  const getDisplayText = () => {
    if (isGenerating) {
      return "Generating QR Code";
    }

    if (
      !(maxUsers && validityDuration && validityDurationType) ||
      parseInt(maxUsers) === 0 ||
      parseInt(validityDuration) === 0
    ) {
      return "Generate Access QR Code";
    }

    return `Valid for ${maxUsers} user${
      parseInt(maxUsers) > 1 ? "s" : ""
    }, expires in ${validityDuration} ${
      validityDurationType === QR_VALIDITY_DURATION_TYPE.MIN
        ? "minute"
        : validityDurationType === QR_VALIDITY_DURATION_TYPE.HOUR
        ? "hour"
        : "day"
    }${parseInt(validityDuration) > 1 ? "s" : ""}`;
  };

  return (
    <Card
      backgroundColor={Colors.white}
      variant="filled"
      borderRadius={Spacing.sm}
    >
      <Text style={{ paddingBottom: Spacing.md, fontWeight: "bold" }}>
        QR Setting
      </Text>
      <TextInput
        control={control}
        name="qrName"
        placeholder="Enter QR name"
        label="QR Name (Optional)"
        editable={!isGenerating}
      />
      <SelectField
        name="maxUsers"
        label="Maximum Users"
        placeholder="Enter max. number of users"
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
        <Text size="sm">Valid Duration</Text>
        <View
          style={{
            flexDirection: "row",
            gap: Spacing.sm,
            alignItems: "center",
            width: "100%",
          }}
        >
          <TextInput
            control={control}
            name="validityDuration"
            placeholder="Enter validity time"
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
              { value: QR_VALIDITY_DURATION_TYPE.MIN, label: "min" },
              { value: QR_VALIDITY_DURATION_TYPE.HOUR, label: "hour" },
              { value: QR_VALIDITY_DURATION_TYPE.DAY, label: "days" },
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
              SB-A1-002
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
            <DummyQRCodeIcon height={75} width={75} />
          ) : isGenerating ? (
            <ActivityIndicator size="large" color={Colors.primary} />
          ) : (
            <PlaceholderQRIcon height={50} width={50} />
          )}
        </View>
        <Text style={{ textAlign: "center" }}>{getDisplayText()}</Text>
      </Card>
      <Button
        variant="primary"
        icon={
          isQrCodeGenerated && (
            <Ionicons name="share-social-outline" size={24} color="white" />
          )
        }
        title={
          isQrCodeGenerated
            ? "Share"
            : isGenerating
            ? "Generating..."
            : "Generate QR Code"
        }
        onPress={onGenerateQR}
        disabled={isGenerating}
      />
    </Card>
  );
};
