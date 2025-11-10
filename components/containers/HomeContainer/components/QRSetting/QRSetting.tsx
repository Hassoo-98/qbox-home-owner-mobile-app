import { Card, ItemInfo, Text } from "@/components";
import { Colors, Spacing } from "@/constants";
import { useWatch } from "react-hook-form";
import { View } from "react-native";
import { QRGenerationForm } from "./components";
import { QRSettingProps } from "./props";
import { QRGenerationSuccessCard } from "./QRGenerationSuccessCard";

export const QRSetting = ({
  isGenerating,
  onGenerateQR,
  isQrCodeGenerated,
  control,
  resetForm,
}: QRSettingProps) => {
  const maxUsers = useWatch({ control, name: "maxUsers" });
  const validityDuration = useWatch({ control, name: "validityDuration" });
  const validityDurationType = useWatch({
    control,
    name: "validityDurationType",
  });

  return (
    <Card
      backgroundColor={Colors.darkGray}
      variant="filled"
      borderRadius={Spacing.sm + 4}
      style={{
        marginVertical: Spacing.md,
        padding: 0,
        width: "100%",
      }}
    >
      <ItemInfo
        title="Box ID"
        description="AB5432"
        style={{
          padding: 0,
        }}
        leftContent={
          <View>
            <Text
              size="md"
              style={{
                marginBottom: Spacing.sm,
              }}
            >
              {"National Address"}
            </Text>
          </View>
        }
        rightContent={
          <View>
            <Text>Right Content</Text>
          </View>
        }
      />
      <QRGenerationForm
        control={control}
        isGenerating={isGenerating}
        onGenerateQR={onGenerateQR}
        isQrCodeGenerated={isQrCodeGenerated}
        resetForm={resetForm}
        maxUsers={maxUsers}
        validityDuration={validityDuration}
        validityDurationType={validityDurationType}
      />
      {isQrCodeGenerated && <QRGenerationSuccessCard />}
    </Card>
  );
};
