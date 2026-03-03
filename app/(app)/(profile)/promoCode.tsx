import { Button, Card, Text } from "@/components";
import { Colors, Spacing } from "@/constants";
import { useOffers } from "@/hooks/api/useHomeQueries";
import { Offer } from "@/services/api/types";
import { mvs } from "@/utils/metrices";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import {
    FlatList,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";

const PromoCodeCard = ({ item }: { item: Offer }) => {
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
      style={styles.card}
      contentStyle={styles.content}
    >
      <Image
        source={fallbackImage}
        onError={() => setImageError(true)}
        style={styles.image}
        contentFit="cover"
      />
      <View style={styles.overlay}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
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

export const PromoCode = () => {
  const { data: offersData, isLoading, error } = useOffers();
  const offers = Array.isArray(offersData) ? offersData : [];

  // Mock data for display
  const mockOffers: Offer[] = [
    {
      id: 1,
      title: "Free Premium Shipping",
      subtitle: "Rate your delivery experience and get 20% off next month",
      description: "Rate your delivery experience and get 20% off next month",
      image_url: require("@/assets/images/offer.jpg"),
      button_text: "Claim Offer",
      button_color: "#11A543",
    },
    {
      id: 2,
      title: "Lorem ipsum",
      subtitle: "Rate your delivery experience and get 20% off next month",
      description: "Rate your delivery experience and get 20% off next month",
      image_url: require("@/assets/images/offer.jpg"),
      button_text: "Claim Offer",
      button_color: "#11A543",
    },
    {
      id: 3,
      title: "Lorem ipsum",
      subtitle: "Rate your delivery experience and get 20% off next month",
      description: "Rate your delivery experience and get 20% off next month",
      image_url: require("@/assets/images/offer.jpg"),
      button_text: "Claim Offer",
      button_color: "#11A543",
    },
    {
      id: 4,
      title: "Lorem ipsum",
      subtitle: "Rate your delivery experience and get 20% off next month",
      description: "Rate your delivery experience and get 20% off next month",
      image_url: require("@/assets/images/offer.jpg"),
      button_text: "Claim Offer",
      button_color: "#11A543",
    },
    {
      id: 5,
      title: "Lorem ipsum",
      subtitle: "Rate your delivery experience and get 20% off next month",
      description: "Rate your delivery experience and get 20% off next month",
      image_url: require("@/assets/images/offer.jpg"),
      button_text: "Claim Offer",
      button_color: "#11A543",
    },
  ];

  const displayOffers = offers.length > 0 ? offers : mockOffers;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Error loading promo codes</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <FlatList
        data={displayOffers}
        keyExtractor={(item, index) => item.id?.toString() || `offer-${index}`}
        scrollEnabled={false}
        renderItem={({ item }) => <PromoCodeCard item={item} />}
        contentContainerStyle={styles.listContainer}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: mvs(Spacing.lg),
    paddingBottom: mvs(Spacing.xxxl),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  listContainer: {
    gap: mvs(Spacing.md),
  },
  card: {
    marginBottom: mvs(Spacing.md),
    width: "100%",
  },
  content: {
    padding: 0,
    position: "relative",
  },
  image: {
    height: 200,
    borderRadius: Spacing.sm + 4,
  },
  overlay: {
    backgroundColor: "rgba(14, 16, 19, 0.8)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: mvs(12),
    borderBottomLeftRadius: Spacing.sm + 4,
    borderBottomRightRadius: Spacing.sm + 4,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontWeight: "bold",
    color: "white",
    fontSize: mvs(16),
    marginBottom: 4,
  },
  description: {
    color: "white",
    lineHeight: 18,
    fontSize: mvs(12),
  },
  button: {
    borderRadius: 100,
    backgroundColor: "#11A543",
  },
});

export default PromoCode;
