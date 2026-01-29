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
  QR_VALIDITY_DURATION_TYPE,
  Spacing,
} from "@/constants";
import { useQRHistory, useQRScans } from "@/hooks/api/useQRQueries";
import { QRCode } from "@/types";
import { mvs } from "@/utils/metrices";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

export const QRCodeDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const [qrCodeData, setQrCodeData] = useState<QRCode>();
  const [qrCodeDescription, setQrCodeDescription] = useState<string>("");

  const { data: qrHistoryData, isLoading: historyLoading } = useQRHistory();
  const { data: qrScansData, isLoading: scansLoading } = useQRScans();

  useEffect(() => {
    if (qrHistoryData && id) {
      const qrCode = qrHistoryData.find(
        (item) => item.id.toString() === id
      );

      if (qrCode) {
        setQrCodeData(qrCode as any);
        setQrCodeDescription(
          `Valid for ${qrCode?.maxUsers} user${qrCode?.maxUsers > 1 ? "s" : ""
          }, ${qrCode?.validityDuration} ${qrCode?.validityDurationType === QR_VALIDITY_DURATION_TYPE.MIN
            ? "minute"
            : qrCode?.validityDurationType ===
              QR_VALIDITY_DURATION_TYPE.HOUR
              ? "hour"
              : "day"
          }${qrCode?.validityDuration > 1 ? "s" : ""}`
        );
      } else {
        console.error("QR Code not found");
        // No auto-back to allow user to see error or loading if it's transient
      }
    }
  }, [id, qrHistoryData]);

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
              title={qrCodeData.title || `QR #${qrCodeData.id}`}
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
              label={qrCodeData.isActive ? "Active" : "Inactive"}
              size="small"
              variant={qrCodeData.isActive ? "success" : "error"}
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

  if (historyLoading || scansLoading) {
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
    (item) => item.qrCodeId === qrCodeData?.id
  );

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      data={filteredScanHistory}
      keyExtractor={(item) => item?.id?.toString()}
      ListHeaderComponent={
        <QRCodeDetailsHeader
          qrCodeData={qrCodeData}
          qrCodeDescription={qrCodeDescription}
        />
      }
      renderItem={({ item }) => <QRScanHistoryItem item={item as any} />}
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
