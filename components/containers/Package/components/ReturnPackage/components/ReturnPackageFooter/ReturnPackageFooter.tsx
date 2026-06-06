import { WarningIconOutline } from "@/assets/icons";
import { Button, Text } from "@/components/ui";
import { Colors, Spacing } from "@/constants";
import { useLocale } from "@/hooks";
import { mvs } from "@/utils/metrices";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import { ReturnPackageFooterProps } from "./props";

export const ReturnPackageFooter = ({
  currentStep,
  setCurrentStep,
  isFormValid,
  onSubmit,
  isPending,
}: ReturnPackageFooterProps) => {
  const { t } = useLocale();

  const packageGuidelines = [
    t("packageGuidelineMaxWeight"),
    t("packageGuidelineFragile"),
    t("packageGuidelineImage"),
    t("packageGuidelinePerishable"),
  ];

  const pinCodeInstruction = [t("pinCodeInstruction")];

  return (
    <View>
      <View
        style={{
          backgroundColor: Colors.border,
          height: 1,
          width: "100%",
          marginBottom: mvs(Spacing.xl),
        }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: Spacing.md,
        }}
      >
        <Button
          title={t("previous")}
          disabled={currentStep === 1}
          variant="default"
          onPress={() => {
            setCurrentStep((prev) => --prev);
          }}
        />
        <Button
          title={currentStep === 2 ? (isPending ? t("loading") : t("confirm")) : t("next")}
          disabled={!isFormValid || isPending}
          loading={isPending}
          onPress={() => {
            switch (currentStep) {
              case 1:
                setCurrentStep((prev) => ++prev);
                return;
              case 2:
                onSubmit();
                return;
            }
          }}
        />
      </View>

      {currentStep === 1 && (
        <View
          style={{
            backgroundColor: Colors.successBackground,
            paddingVertical: Spacing.md,
            paddingHorizontal: Spacing.lg,
            borderRadius: Spacing.sm,
            flexDirection: "row",
            gap: Spacing.sm,
            alignItems: "flex-start",
          }}
        >
          <Ionicons name="information-circle-outline" size={24} color={Colors.successDark} />

          <View style={{ flex: 1, flexShrink: 1 }}>
            <Text size="sm" color={Colors.successDark} style={{ fontWeight: "bold" }}>
              {t("pinCode")}
            </Text>
            {pinCodeInstruction.map((item, index) => (
              <View key={index}>
                <Text size="sm" color={Colors.successDark}>
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {currentStep === 2 && (
        <View
          style={{
            backgroundColor: Colors.warning,
            paddingVertical: Spacing.md,
            paddingHorizontal: Spacing.lg,
            borderRadius: Spacing.sm,
            flexDirection: "row",
            gap: Spacing.sm,
            alignItems: "flex-start",
          }}
        >
          <WarningIconOutline width={20} height={20} />
          <View style={{ flex: 1, flexShrink: 1 }}>
            <Text size="sm" variant="warning" style={{ fontWeight: "bold" }}>
              {t("packageGuidelines")}
            </Text>
            {packageGuidelines.map((item, index) => (
              <View key={index}>
                <Text size="sm" variant="warning">
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};
