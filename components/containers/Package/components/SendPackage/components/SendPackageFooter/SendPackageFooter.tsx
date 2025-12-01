import { WarningIconOutline } from "@/assets/icons";
import { Button, Text } from "@/components/ui";
import { Colors, Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import React from "react";
import { View } from "react-native";
import { SendPackageFooterProps } from "./props";

export const SendPackageFooter = ({
  currentStep,
  setCurrentStep,
  isFormValid,
  onSubmit,
  phoneNumber,
}: SendPackageFooterProps) => {
  const packageGuidelines = [
    "Maximum weight: 5kg",
    "Fragile items must be properly packaged",
    "Upload image for the prepared package.",
    "No perishable food items for long-distance delivery",
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
          title="Previous"
          disabled={currentStep === 1}
          variant="default"
          onPress={() => {
            setCurrentStep((prev) => --prev);
          }}
        />
        <Button
          title="Next"
          disabled={!isFormValid}
          onPress={() => {
            console.log("current step: ", currentStep);
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
            alignItems: "flex-start", // Important: align to top, not center
          }}
        >
          <WarningIconOutline width={20} height={20} />

          {/* Wrap text content in a flexible container */}
          <View style={{ flex: 1, flexShrink: 1 }}>
            <Text
              size="sm"
              variant="warning"
              style={{ fontWeight: "bold" }}
              numberOfLines={undefined} // Allow unlimited lines
            >
              Package Guidelines
            </Text>
            {packageGuidelines.map((item, index) => {
              return (
                <View key={index}>
                  <Text size="sm" variant="warning" numberOfLines={undefined}>
                    {item}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};
