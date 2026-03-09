import { BoxInfo, BoxInfoSkeleton, Offer, OfferSkeleton, QRSetting, QRSettingSkeleton, Text } from "@/components";
import { Colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  View
} from "react-native";
import { styles } from "./styles";
import { useHomeLogic } from "./useHomeLogic";

export const Home = () => {
  const {
    offersData,
    offersLoading,
    offersError,
    isGenerating,
    showSuccess,
    isQrCodeGenerated,
    control,
    handleGenerateQR,
    resetForm,
    homeOwner,
    homeOwnerLoading,
  } = useHomeLogic();



  // Extract offers safely
  const offers = Array.isArray(offersData) ? offersData : [];

  // Render loading state
  if (homeOwnerLoading || isGenerating) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BoxInfoSkeleton />
        <FlatList
          data={[1, 2, 3]}
          keyExtractor={(item) => item.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.flatList}
          renderItem={() => <OfferSkeleton />}
        />
        <QRSettingSkeleton />
      </ScrollView>
    );
  }

  // Render error state (optional)
  if (offersError) {
    return (
      <View style={styles.errorContainer}>
        <Text>Failed to load offers</Text>
      </View>
    );
  }



  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <BoxInfo
          boxId={homeOwner?.qboxes?.[0]?.qbox_id || "QB-10089912"}
          address={homeOwner?.address?.short_address || "No Address"}
          packageCount={0} // Placeholder until package API is integrated
          status={homeOwner?.qboxes?.[0]?.status || "Offline"}
        />
        {offers.length > 0 &&
          <FlatList
            data={offers}
            keyExtractor={(item, index) => item.id?.toString() || `offer-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.flatList}
            renderItem={({ item }) => <Offer item={item} />}
          />
        }
        <QRSetting
          boxId={homeOwner?.qboxes?.[0]?.qbox_id || "QB-10089912"}
          address={homeOwner?.address?.short_address || "No Address"}
          image={homeOwner?.installation?.qbox_image_url || ""}
          isGenerating={isGenerating}
          resetForm={resetForm}
          control={control}
          onGenerateQR={handleGenerateQR}
          isQrCodeGenerated={isQrCodeGenerated}
        />

      </ScrollView>

      <Modal animationType="fade" transparent={true} visible={showSuccess}>
        <BlurView
          intensity={Platform.OS === "ios" ? 30 : 80}
          tint="dark"
          style={styles.blurContainer}
        >
          <View style={styles.successCard}>
            <Ionicons
              name="checkmark-circle"
              size={25}
              color={Colors.success}
            />
            <Text style={styles.successTitle}>QR Code generated!</Text>
          </View>
        </BlurView>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default Home;
