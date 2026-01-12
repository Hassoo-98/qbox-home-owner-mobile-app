import { Text } from "@/components";
import { Colors } from "@/constants";
import React from "react";
import { View } from "react-native";
import { PackageDetailsDescriptionProps } from "./props";
import { styles } from "./style";

export const PackageDetailsDescription = ({
  description,
}: PackageDetailsDescriptionProps) => {
  return (
    <View style={styles.sectionContainer}>
      <Text bold color={Colors.dark}>
        Package Description
      </Text>
      <Text size="sm" variant="secondary">
        {description}
      </Text>
    </View>
  );
};
