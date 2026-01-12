import { Card, Text } from "@/components/ui";
import { Colors, Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import React from "react";
import { View } from "react-native";
import { InfoSectionProps } from "./props";

export const SpecificInfoSection = ({
  title = "Details",
  description,
  value,
  containerStyle,
}: InfoSectionProps) => {
  return (
    <View style={[{ marginTop: mvs(Spacing.lg) }, containerStyle]}>
      {title && (
        <Text bold color={Colors.dark}>
          {title}
        </Text>
      )}

      <Card variant="filled">
        {description && (
          <Text size="sm" variant="secondary">
            {description}
          </Text>
        )}

        <Text bold color={Colors.dark}>
          {value}
        </Text>
      </Card>
    </View>
  );
};
