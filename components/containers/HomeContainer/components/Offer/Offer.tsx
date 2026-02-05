import { Button, Card, OfferProps, Text } from "@/components";
import { Image } from "expo-image";
import { useState } from "react";
import { Dimensions, View } from "react-native";
import { styles } from "./styles";

export const Offer = ({ item }: OfferProps) => {
  const { width: screenWidth } = Dimensions.get("window");
  const [imageError, setImageError] = useState(false);
  const fallbackImage = require("@/assets/images/offer.jpg");

  return (
    <Card
      backgroundColor="transparent"
      variant="filled"
      borderRadius={styles.image.borderRadius}
      style={[styles.card, { width: screenWidth - 64 }]}
      contentStyle={styles.content}
    >
      <Image
        source={!imageError && item.image_url ? item.image_url : fallbackImage}
        onError={() => setImageError(true)}
        style={[styles.image, { width: screenWidth - 32 }]}
        contentFit="cover"
      />
      <View style={styles.overlay}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {item.title}
          </Text>
          <Text size="sm" style={styles.description}>
            {item.description}
          </Text>
        </View>
        <Button
          title={item.button_text}
          size="xs"
          style={[styles.button, { backgroundColor: item?.button_color }]}
        />
      </View>
    </Card>
  );
};
