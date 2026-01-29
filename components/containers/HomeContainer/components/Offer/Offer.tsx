import { Button, Card, OfferProps, Text } from "@/components";
import { Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import { Image } from "expo-image";
import { useState } from "react";
import { Dimensions, View } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

export const Offer = ({ item }: OfferProps) => {
  const [imageError, setImageError] = useState(false);
  const fallbackImage = require("@/assets/images/offer.jpg");

  return (
    <Card
      backgroundColor="transparent"
      variant="filled"
      borderRadius={Spacing.sm + 4}
      style={{
        marginTop: Spacing.md,
        width: screenWidth - 64,
        marginRight: Spacing.md,
      }}
      contentStyle={{ padding: 0, position: "relative" }}
    >
      <Image
        source={!imageError && item.image_url ? item.image_url : fallbackImage}
        onError={() => setImageError(true)}
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
          padding: mvs(8),
          borderBottomLeftRadius: Spacing.sm + 4,
          borderBottomRightRadius: Spacing.sm + 4,
        }}
      >
        <View style={{ flex: 1, marginRight: 12 }}>
          <Text
            style={{
              fontWeight: "bold",
              color: "white",
              fontSize: mvs(16),
              marginBottom: 4,
            }}
          >
            {item.title}
          </Text>
          <Text
            size="sm"
            style={{ color: "white", lineHeight: 18, fontSize: mvs(12) }}
          >
            {item.description}
          </Text>
        </View>
        <Button
          title={item.button_text}
          size="xs"
          style={{ borderRadius: 100, backgroundColor: item?.button_color }}
        />
      </View>
    </Card>
  );
};
