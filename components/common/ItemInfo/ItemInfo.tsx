import { Text } from "@/components";
import { Colors, Spacing } from "@/constants";
import { View } from "react-native";
import { ItemInfoProps } from "./props";

export const ItemInfo = ({
  title,
  description,
  leftContent,
  rightContent,
  style = {},
}: ItemInfoProps) => {
  return (
    <View
      style={[{ flexDirection: "row", justifyContent: "space-between" }, style]}
    >
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <Text
          size="xs"
          style={{
            color: Colors.secondaryText,
            marginBottom: 2,
          }}
        >
          {title}
        </Text>
        <Text
          size="xl"
          style={{
            fontWeight: "700",
            marginBottom: Spacing.xs,
          }}
        >
          {description}
        </Text>
        {leftContent && leftContent}
      </View>

      {rightContent && rightContent}
    </View>
  );
};
