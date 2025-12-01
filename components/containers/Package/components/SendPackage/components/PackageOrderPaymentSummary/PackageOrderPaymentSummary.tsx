import { Text } from "@/components";
import { Colors } from "@/constants";
import React, { useMemo } from "react";
import { View } from "react-native";
import { PackageOrderPaymentSummaryProps } from "./props";
import { styles } from "./style";

export const PackageOrderPaymentSummary = ({
  paymentSummary,
}: PackageOrderPaymentSummaryProps) => {
  const total = useMemo(
    () =>
      paymentSummary.charges.reduce(
        (sum: number, charge: any) => sum + charge.value,
        0
      ),
    [paymentSummary.charges]
  );

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.summaryHeader}>
        <Text bold color={Colors.dark}>
          Order Summary
        </Text>
      </View>
      {paymentSummary.charges.map((item: any, index: number) => (
        <View key={`charge-${index}`} style={styles.summaryRow}>
          <Text>{item.key}</Text>
          <Text>{`${paymentSummary.currency} ${item.value}`}</Text>
        </View>
      ))}
      <View style={styles.summaryTotalRow}>
        <Text bold>Total</Text>
        <Text bold>{`${paymentSummary.currency} ${total}`}</Text>
      </View>
    </View>
  );
};
