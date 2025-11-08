import { Button, Chip, Text } from "@/components";
import { Colors, Spacing } from "@/constants";
import { View } from "react-native";
import { BoxDetailsProps } from "./props";

export const BoxDetails = ({ address, noOfPackages }: BoxDetailsProps) => {
  return (
    <View>
      <Text
        size="md"
        style={{
          marginBottom: Spacing.sm,
        }}
      >
        {address || "National Address"}
      </Text>
      <Chip
        label={`${noOfPackages || 1} Package inside`}
        backgroundColor={Colors.primary}
        textColor={Colors.white}
        size="small"
        style={{ marginBottom: Spacing.md }}
      />

      <View
        style={{
          flexDirection: "row",
          gap: Spacing.xs,
        }}
      >
        <Button
          title="Open Box"
          size="xs"
          style={{
            backgroundColor: Colors.white,
          }}
          textStyle={{
            color: Colors.primary,
          }}
        />
        <Button
          title="Live View"
          size="xs"
          style={{
            backgroundColor: Colors.white,
          }}
          textStyle={{
            color: Colors.primary,
          }}
        />
      </View>
    </View>
  );
};
