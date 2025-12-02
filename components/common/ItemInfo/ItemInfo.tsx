import { Text } from "@/components";
import { Colors, Spacing } from "@/constants";
import { View } from "react-native";
import { ItemInfoProps } from "./props";

export const ItemInfo = ({
  title,
  description,
  leftContent,
  rightContent,
  titleProps,
  descriptionProps,
  style = {},
}: ItemInfoProps) => {
  const { style: titleStyle, ...titleRestProps } = titleProps || {};
  const { style: descriptionStyle, ...descriptionRestProps } =
    descriptionProps || {};

  return (
    <View
      style={[{ flexDirection: "row", justifyContent: "space-between" }, style]}
    >
      <View style={{ flex: 1 }}>
        <View>
          <Text
            size="xs"
            {...titleRestProps}
            style={[
              {
                color: Colors.secondaryText,
                marginBottom: 2,
              },
              titleStyle,
            ]}
          >
            {title}
          </Text>
          <Text
            size="xl"
            {...descriptionRestProps}
            style={[
              {
                fontWeight: "700",
                marginBottom: Spacing.xs,
              },
              descriptionStyle,
            ]}
          >
            {description}
          </Text>
        </View>
        {leftContent && leftContent}
      </View>

      {rightContent && rightContent}
    </View>
  );
};
