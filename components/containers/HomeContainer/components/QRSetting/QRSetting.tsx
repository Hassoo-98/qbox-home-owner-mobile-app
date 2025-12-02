import { Card, ItemInfo, Text } from "@/components";
import { BorderRadius, Colors, Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import { Image } from "expo-image";
import { useWatch } from "react-hook-form";
import { Dimensions, View } from "react-native";
import { QRGenerationForm } from "./components";
import { QRSettingProps } from "./props";
import { QRGenerationSuccessCard } from "./QRGenerationSuccessCard";
const { width: screenWidth } = Dimensions.get("window");

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

  const imageWidth = screenWidth * 0.25;

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
            <Image
              source={require("@/assets/images/packageItem.jpg")}
              style={{
                width: imageWidth,
                height: imageWidth,
                marginBottom: mvs(8),
                borderRadius: BorderRadius.sm,
              }}
              contentFit="cover"
            />
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
