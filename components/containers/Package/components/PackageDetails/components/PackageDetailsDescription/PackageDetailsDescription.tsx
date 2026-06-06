import { Text } from "@/components";
import { Colors } from "@/constants";
import { useLocale } from "@/hooks";
import React from "react";
import { View } from "react-native";
import { PackageDetailsDescriptionProps } from "./props";
import { styles } from "./style";

export const PackageDetailsDescription = ({
  description,
}: PackageDetailsDescriptionProps) => {
  const { t } = useLocale();

  return (
    <View style={styles.sectionContainer}>
      <Text bold color={Colors.dark}>
        {t("packageDescription")}
      </Text>
      <Text size="sm" variant="secondary">
        {description}
      </Text>
    </View>
  );
};
