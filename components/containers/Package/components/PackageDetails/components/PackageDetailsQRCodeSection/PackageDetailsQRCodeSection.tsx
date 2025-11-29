import { Card, Text } from "@/components/ui";
import { Colors, Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import React from "react";
import { View } from "react-native";

export const PackageDetailsQRCodeSection = ({ qrCode }: { qrCode: string }) => {
  return (
    <View style={{ marginTop: mvs(Spacing.lg) }}>
      <Text bold color={Colors.dark}>
        Assigned QR Code
      </Text>
      <Card variant="filled">
        <Text size="sm" variant="secondary">
          QR Code
        </Text>
        <Text bold color={Colors.dark}>
          {qrCode}
        </Text>
      </Card>
    </View>
  );
};
