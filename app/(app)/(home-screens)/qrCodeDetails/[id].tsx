import { DeletetIcon, ShareIcon } from "@/assets/icons";
import {
  AppHeaderLeft,
  AppHeaderTitle,
  Chip,
  QRCodeDetailsHeader,
  QRScanHistoryItem,
  QRScanHistoryItemSkeleton,
  Text
} from "@/components";
import {
  Colors,
  Spacing
} from "@/constants";
import { useQRCodeDetails, useQRScans } from "@/hooks/api/useQRQueries";
import { mvs } from "@/utils/metrices";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";

export const QRCodeDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();

  const { data: qrResponse, isLoading: detailsLoading } = useQRCodeDetails(id);
  const qrCodeData = qrResponse?.data;
  const { data: qrScansData, isLoading: scansLoading } = useQRScans();

  const qrCodeDescription = qrCodeData ? `Valid for ${qrCodeData.max_users} user${qrCodeData.max_users > 1 ? "s" : ""}, ${qrCodeData.valid_duration} ${qrCodeData.duration_type}` : "";

  useLayoutEffect(() => {
    if (qrCodeData) {
      navigation.setOptions({
        headerLeft: () => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <AppHeaderLeft canGoBack />
            <AppHeaderTitle
              title={qrCodeData.name || `QR #${qrCodeData.id}`}
              customStyle={{
                width: "52%",
                justifyContent: "flex-end",
                alignItems: "flex-end",
              }}
            />
            <View>
              <Text> </Text>
            </View>
            <Chip
              label={qrCodeData.status}
              size="small"
              variant={qrCodeData.status === "Active" ? "success" : "error"}
            />
          </View>
        ),
        headerRight: () => {
          return (
            <View style={{ flexDirection: "row", gap: mvs(10) }}>
              <ShareIcon />
              <DeletetIcon />
            </View>
          );
        },
      });
    }
  }, [qrCodeData, navigation]);

  // If we have NO data and we are loading, show full skeleton
  if (detailsLoading && !qrCodeData) {
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          data={[1, 2, 3]}
          keyExtractor={(item) => item.toString()}
          ListHeaderComponent={
            <View style={{ marginBottom: mvs(Spacing.xl) }}>
              <View style={{ height: 100, backgroundColor: Colors.border, borderRadius: 12, opacity: 0.3 }} />
            </View>
          }
          renderItem={() => <QRScanHistoryItemSkeleton />}
        />
      </View>
    );
  }

  if (!qrCodeData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>QR Code not found</Text>
      </View>
    );
  }

  const filteredScanHistory = (qrScansData || []).filter(
    (item) => item.qrCodeId.toString() === id // Match string ID
  );

  // Map QRCodeData to the QRCode shape if needed, or pass directly
  const qrCodeForHeader = {
    ...qrCodeData,
    createdAt: qrCodeData.created_at ? new Date(qrCodeData.created_at) : new Date(),
    usersLeft: qrCodeData.remaining_users,
  };

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      data={scansLoading ? [] : filteredScanHistory}
      keyExtractor={(item) => item?.id?.toString()}
      ListHeaderComponent={
        <QRCodeDetailsHeader
          qrCodeData={qrCodeForHeader as any}
          qrCodeDescription={qrCodeDescription}
        />
      }
      renderItem={({ item }) => <QRScanHistoryItem item={item as any} />}
      ListEmptyComponent={
        scansLoading ? (
          <View style={{ gap: mvs(Spacing.md) }}>
            <QRScanHistoryItemSkeleton />
            <QRScanHistoryItemSkeleton />
            <QRScanHistoryItemSkeleton />
          </View>
        ) : (
          <Text style={{ textAlign: "center", marginTop: mvs(Spacing.xl), opacity: 0.5 }}>
            No scan history found
          </Text>
        )
      }
    />
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
  },
});

export default QRCodeDetails;
