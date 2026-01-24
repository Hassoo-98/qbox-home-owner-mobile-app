import { QRCodeHistoryItem, Text } from "@/components";
import { Colors, Spacing } from "@/constants";
import { useQRHistory } from "@/hooks/api/useQRQueries";
import { QRCode } from "@/types";
import { mvs } from "@/utils/metrices";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, FlatList, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const QRCodeHistory = () => {
  const { data: qrHistoryData, isLoading } = useQRHistory();

  const handleShare = (item: QRCode) => {
    // Implement share functionality
    console.log("Sharing QR Code:", item.title);
  };

  const handleMarkAsExpire = (item: QRCode) => {
    // Implement mark as expire functionality
    console.log("Marking as expired:", item.id);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          padding: mvs(Spacing.lg),
          marginBottom: mvs(Spacing.lg),
        }}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: Spacing.xl }} />
        ) : (
          <FlatList
            data={qrHistoryData || []}
            keyExtractor={(item) => item?.id?.toString()}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: Spacing.sm,
                  marginBottom: mvs(Spacing.md),
                }}
              >
                <Text size="lg" style={{ fontWeight: "bold" }}>
                  QR History
                </Text>
                <Ionicons name="information-circle-outline" size={23} />
              </View>
            }
            renderItem={({ item }) => (
              <QRCodeHistoryItem
                item={item as any}
                onShare={handleShare}
                onMarkAsExpire={handleMarkAsExpire}
              />
            )}
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default QRCodeHistory;
