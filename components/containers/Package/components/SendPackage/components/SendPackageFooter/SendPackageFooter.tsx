import { WarningIconOutline } from "@/assets/icons";
import { Button, Text } from "@/components/ui";
import { Colors, Spacing } from "@/constants";
import { useLocale } from "@/hooks";
import { mvs } from "@/utils/metrices";
import React from "react";
import { View } from "react-native";
import { SendPackageFooterProps } from "./props";

export const SendPackageFooter = ({
  currentStep,
  setCurrentStep,
  onSubmit,
  isPending,
  isQBoxVerified,
  validateStep,
}: SendPackageFooterProps) => {
  const { t } = useLocale();
  const packageGuidelines = [
    t("packageGuidelineMaxWeight"),
    t("packageGuidelineFragile"),
    t("packageGuidelineImage"),
    t("packageGuidelinePerishable"),
  ];

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
          title={currentStep === 3 ? t("submit") : t("next")}
          disabled={currentStep === 1 && !isQBoxVerified}
          onPress={async () => {
            const canProceed = await validateStep(currentStep);
            if (!canProceed) return;

            switch (currentStep) {
              case 1:
                setCurrentStep((prev) => ++prev);
                return;
              case 2:
                setCurrentStep((prev) => ++prev);
                return;
              case 3:
                onSubmit();
                return;
            }
          }}
          loading={currentStep === 3 && isPending}
        />
      </View>

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
