import { Chip, Text } from "@/components";
import { Colors } from "@/constants";
import React, { useMemo } from "react";
import { View } from "react-native";
import { PackageDetailsPaymentSummaryProps } from "./props";
import { styles } from "./style";

export const PackageDetailsPaymentSummary = ({
  paymentSummary,
}: PackageDetailsPaymentSummaryProps) => {
  const formatChargeLabel = (label: string) => {
    return label
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const total = useMemo(() => {
    if (typeof paymentSummary.charges === "number") {
      return paymentSummary.charges;
    }
    return paymentSummary.charges.reduce(
      (sum: number, charge: any) => sum + charge.value,
      0
    );
  }, [paymentSummary.charges]);

  const currency = paymentSummary.currency || "SAR";

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.summaryHeader}>
        <Text bold color={Colors.dark}>
          Payment Summary
        </Text>
        <Chip label={paymentSummary.paymentMethod} variant="info" />
      </View>
      {Array.isArray(paymentSummary.charges) ? (
        paymentSummary.charges.map((item: any, index: number) => (
          <View key={`charge-${index}`} style={styles.summaryRow}>
            <Text>{formatChargeLabel(item.key)}</Text>
            <Text>{`${currency} ${item.value}`}</Text>
          </View>
        ))
      ) : (
        <View style={styles.summaryRow}>
          <Text>Service Charges</Text>
          <Text>{`${currency} ${paymentSummary.charges}`}</Text>
        </View>
      )}
      <View style={styles.summaryTotalRow}>
        <Text bold>Total</Text>
        <Text bold>{`${currency} ${total}`}</Text>
      </View>
    </View>
  );
};
