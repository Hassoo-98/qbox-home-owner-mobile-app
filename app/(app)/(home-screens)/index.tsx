import { BoxInfo, Offer, OfferSkeleton, QRSetting, Text } from "@/components";
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
    isGenerating,
    showSuccess,
    isQrCodeGenerated,
    control,
    handleGenerateQR,
    resetForm,
    homeOwner,
  } = useHomeLogic();



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
          boxId={homeOwner?.qboxes?.[0]?.qbox_id || "N/A"}
          address={homeOwner?.address?.short_address || "No Address"}
          packageCount={0} // Placeholder until package API is integrated
          status={homeOwner?.qboxes?.[0]?.status || "Offline"}
        />
        {offersLoading ? (
          <FlatList
            data={[1, 2, 3]}
            keyExtractor={(item) => item.toString()}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            style={styles.flatList}
            renderItem={() => <OfferSkeleton />}
          />
        ) : !offersData || offersData.length === 0 ? (
          null
        ) : (
          <FlatList
            data={offersData}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            style={styles.flatList}
            renderItem={({ item }) => <Offer item={item} />}
          />
        )}
        <QRSetting
          boxId={homeOwner?.qboxes?.[0]?.qbox_id || "N/A"}
          address={homeOwner?.address?.short_address || "No Address"}
          image={homeOwner?.installation_qbox_image_url || ""}
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
