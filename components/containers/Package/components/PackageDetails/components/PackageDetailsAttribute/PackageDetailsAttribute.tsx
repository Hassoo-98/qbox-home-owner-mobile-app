import { AttributeView, Text } from "@/components";
import { Colors, PACKAGE_ATTRIBUTE_DATA } from "@/constants";
import React from "react";
import { View } from "react-native";
import { PackageDetailsAttributeProps } from "./props";
import { styles } from "./style";

export const PackageDetailsAttribute = ({
  attributes,
}: PackageDetailsAttributeProps) => {
  return (
    <View style={styles.sectionContainer}>
      <Text bold color={Colors.dark}>
        What inside
      </Text>
      <View style={styles.attributeContainer}>
        {attributes.map((attr, index) => (
          <AttributeView
            key={`${attr.type}-${index}`}
            item={{
              id: index.toString(),
              icon: PACKAGE_ATTRIBUTE_DATA[index]?.icon,
              title: attr.type,
              statusText: attr.value,
            }}
            width="32%"
            style={{ backgroundColor: Colors.darkGray }}
          />
        ))}
      </View>
    </View>
  );
};
