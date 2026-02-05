import { BoxInfo, Button, EmptyState, Offer, OfferSkeleton, QRSetting, Text } from "@/components";
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
        <BoxInfo />
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
          <EmptyState
            title="No Offers Today"
            description="Special offers will appear here when available."
            containerStyle={{ height: 180, minHeight: 180 }}
          />
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
          isGenerating={isGenerating}
          resetForm={resetForm}
          control={control}
          onGenerateQR={handleGenerateQR}
          isQrCodeGenerated={isQrCodeGenerated}
        />

        <Button
          title="Test OTA update"
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
