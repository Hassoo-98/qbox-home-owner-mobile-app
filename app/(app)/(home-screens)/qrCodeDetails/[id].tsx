import { DeletetIcon, ShareIcon } from "@/assets/icons";
import {
  AppHeaderLeft,
  AppHeaderTitle,
  Chip,
  QRCodeDetailsHeader,
  QRScanHistoryItem,
  Text,
} from "@/components";
import {
  Colors,
  QR_CODE_HISTORY,
  QR_SCAN_HISTORY,
  QR_VALIDITY_DURATION_TYPE,
  Spacing,
} from "@/constants";
import { QRCode } from "@/types";
import { mvs } from "@/utils/metrices";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

export const QRCodeDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const [qrCodeData, setQrCodeData] = useState<QRCode>();
  const [qrCodeDescription, setQrCodeDescription] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQRCodeData = () => {
      try {
        const qrCode = QR_CODE_HISTORY.find(
          (item) => item.id.toString() === id
        );

        if (qrCode) {
          setQrCodeData(qrCode);
          setQrCodeDescription(
            `Valid for ${qrCode?.maxUsers} user${
              qrCode?.maxUsers > 1 ? "s" : ""
            }, ${qrCode?.validityDuration} ${
              qrCode?.validityDurationType === QR_VALIDITY_DURATION_TYPE.MIN
                ? "minute"
                : qrCode?.validityDurationType ===
                  QR_VALIDITY_DURATION_TYPE.HOUR
                ? "hour"
                : "day"
            }${qrCode?.validityDuration > 1 ? "s" : ""}`
          );
        } else {
          console.error("QR Code not found");
          router.back();
        }
      } catch (error) {
        console.error("Error fetching QR code data:", error);
        router.back();
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQRCodeData();
    }
  }, [id]);

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
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

  const filteredScanHistory = QR_SCAN_HISTORY.filter(
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
      renderItem={({ item }) => <QRScanHistoryItem item={item} />}
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
