import { Button, Card, OfferProps, Text } from "@/components";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { Dimensions, View } from "react-native";
import { styles } from "./styles";

export const Offer = ({ item }: OfferProps) => {
  const { width: screenWidth } = Dimensions.get("window");
  const [imageError, setImageError] = useState(false);
  const fallbackImage = require("@/assets/images/offer.jpg");

  const handleClaimOffer = () => {
    router.push(`/(app)/(home-screens)/offerDetails/${item.id}`);
  };

  return (
    <Card
      backgroundColor="transparent"
      variant="filled"
      borderRadius={styles.image.borderRadius}
      style={[styles.card, { width: screenWidth - 64 }]}
      contentStyle={styles.content}
    >
      <Image
        source={fallbackImage}
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
            {item.subtitle || item.description}
          </Text>
        </View>
        <Button
          title="Claim Offer"
          size="xs"
          style={styles.button}
          onPress={handleClaimOffer}
        />
      </View>
    </Card>
  );
};
