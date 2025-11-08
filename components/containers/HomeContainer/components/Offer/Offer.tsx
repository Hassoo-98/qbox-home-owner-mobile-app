import { Button, Card, OfferProps, Text } from "@/components";
import { Spacing } from "@/constants";
import { Image } from "expo-image";
import { Dimensions, View } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

export const Offer = ({ item }: OfferProps) => {
  return (
    <Card
      backgroundColor="transparent"
      variant="filled"
      borderRadius={Spacing.sm + 4}
      style={{
        marginTop: Spacing.md,
        width: screenWidth - 32,
        marginRight: Spacing.md,
      }}
      contentStyle={{ padding: 0 }}
    >
      <View style={{ position: "relative" }}>
        <Image
          source={item.image}
          style={{
            width: screenWidth - 32,
            height: 200,
            borderRadius: Spacing.sm + 4,
          }}
          contentFit="cover"
        />
        <View
          style={{
            backgroundColor: "rgba(14, 16, 19, 0.8)",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: 16,
            borderBottomLeftRadius: Spacing.sm + 4,
            borderBottomRightRadius: Spacing.sm + 4,
          }}
        >
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text
              style={{
                fontWeight: "bold",
                color: "white",
                fontSize: 16,
                marginBottom: 4,
              }}
            >
              {item.title}
            </Text>
            <Text size="sm" style={{ color: "white", lineHeight: 18 }}>
              {item.description}
            </Text>
          </View>
          <Button
            title={item.buttonText}
            size="sm"
            style={{ borderRadius: 100, backgroundColor: item?.buttonColor }}
          />
        </View>
      </View>
    </Card>
  );
};
