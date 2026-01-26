import { BoxInfo, EmptyState, Offer, OfferSkeleton, QRSetting, Text } from "@/components";
import {
  Colors,
  QR_VALIDITY_DURATION_TYPE,
  Spacing,
} from "@/constants";
import { useModal, useShare } from "@/hooks";
import { useOffers } from "@/hooks/api/useHomeQueries";
import { useGenerateQR } from "@/hooks/api/useQRQueries";
import { QRGenerationFormValues } from "@/types";
import { QRGenerationFormResolver } from "@/utils";
import { mvs } from "@/utils/metrices";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  View
} from "react-native";

export const Home = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [isQrCodeGenerated, setIsQrCodeGenerated] = useState(false);
  const { onRequestOTP } = useModal();

  const { data: offersData, isLoading: offersLoading } = useOffers();
  const generateQRMutation = useGenerateQR();

  const defaultFormValues = {
    qrName: "",
    maxUsers: "0",
    validityDuration: "",
    validityDurationType: QR_VALIDITY_DURATION_TYPE.MIN,
  };
  const { onShare } = useShare();

  const { control, handleSubmit, reset } = useForm<QRGenerationFormValues>({
    defaultValues: defaultFormValues,
    resolver: QRGenerationFormResolver,
  });

  const handleGenerateQR = handleSubmit(
    async (data: QRGenerationFormValues) => {
      // If QR already generated → directly share and stop execution
      if (isQrCodeGenerated) {
        return onShare("QR Code generated", "https://myqbox.com/status/123");
      }

      console.log("QR Generation Form Data:", JSON.stringify(data, null, 4));
      setIsGenerating(true);

      try {
        await generateQRMutation.mutateAsync({
          user_id: "current_user_id", // This should come from auth context
          locker_id: "L-101", // This should be selected or default
          guest_name: data.qrName || "Guest",
          valid_hours: parseInt(data.validityDuration || "1") || 1,
        });

        setIsGenerating(false);
        setShowSuccess(true);
        setIsQrCodeGenerated(true);

        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);

        console.log("QR Code generated successfully");
      } catch (error) {
        setIsGenerating(false);
        console.error("QR generation failed:", error);
      }
    }
  );

  const resetForm = () => {
    reset(defaultFormValues);
    setIsQrCodeGenerated(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
      }}
    >
      <ScrollView
        style={{
          flex: 1,
        }}
        contentContainerStyle={{
          padding: Spacing.md,
          paddingBottom: Spacing.xxxl + Spacing.lg,
        }}
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
            style={{ flexGrow: 0 }}
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
            style={{
              flexGrow: 0,
            }}
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

        {/* <Button title="Driver OTP Request Modal" onPress={onRequestOTP} /> */}
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

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    padding: Spacing.md,
  },
  blurContainerDriverRequestModal: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: "center",
    width: "100%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "100%",
    maxWidth: 500,
    overflow: "hidden",
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: mvs(16),
    padding: mvs(20),
    width: "100%",
    maxWidth: 400,
    justifyContent: "center",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: mvs(8),
  },
  closeButton: {
    padding: mvs(4),
  },
  closeButtonText: {
    fontSize: 20,
    color: Colors.secondaryText,
  },
  successCard: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.md,
    marginTop: Spacing.lg,
    padding: Spacing.md,
    alignItems: "center",
    flexDirection: "row",
    minWidth: 280,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  checkmarkContainer: {
    marginBottom: Spacing.md,
  },
  checkmarkCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.success || "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    fontSize: 32,
    color: Colors.white,
    fontWeight: "bold",
  },
  successTitle: {
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Home;
