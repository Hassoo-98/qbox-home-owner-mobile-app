import { RecordingIcon, ReportIcon } from "@/assets/icons";
import {
  AppHeaderLeft,
  AppHeaderTitle,
  Button,
  Chip,
  PackageDetailsAttribute,
  PackageDetailsDescription,
  PackageDetailsHeader,
  PackageDetailsTimeLine,
  PackageReportModal,
  Skeleton,
  SpecificInfoSection,
  Text,
  VideoRecording
} from "@/components";
import {
  Colors,
  PACKAGE_TYPE,
  Spacing,
} from "@/constants";
import { usePackageDetails, usePackageTimeline } from "@/hooks/api/useShipmentQueries";
import { mvs } from "@/utils/metrices";
import { Feather, Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useVideoPlayer } from "expo-video";
import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { Modal, ScrollView, StyleSheet, View } from "react-native";

export const PackageDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);

  const { data: response, isLoading: detailsLoading, error } = usePackageDetails(id || "");
  const packageData = response?.data;
  const { data: timelineRawData, isLoading: timelineLoading } = usePackageTimeline(id || "");

  const { handleSubmit, control } = useForm({
    defaultValues: {
      reportDescription: "",
      trackingId: "",
      reportType: "",
    },
  });

  // ✅ ALWAYS call the hook - no conditions before it
  const videoPlayer = useVideoPlayer(
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    (player) => {
      player.loop = false;
      player.muted = false;
    }
  );

  // Map new data structure to UI expectations
  const mappedPackageData = useMemo(() => {
    if (!packageData) return null;
    return {
      ...packageData,
      trackingId: packageData.tracking_id,
      courierName: packageData.merchant_name || packageData.service_provider,
      lastUpdate: packageData.last_update ? new Date(packageData.last_update) : new Date(),
      createdAt: packageData.created_at ? new Date(packageData.created_at) : new Date(),
      type: packageData.package_status.toLowerCase() as any,
      qrCode: packageData.qr_code,
      description: packageData.details?.summary || "No description available",
      attributes: [
        { type: "Type", value: packageData.details?.package_type || "N/A" },
        { type: "Size", value: packageData.details?.package_size || "N/A" },
        { type: "Weight", value: packageData.details?.package_weight || "N/A" },
      ],
      // Fallback or placeholder for image if not in API
      imageUrl: "",
    };
  }, [packageData]);

  // Determine if we should show video features
  const shouldShowVideo = !!mappedPackageData && mappedPackageData.type === PACKAGE_TYPE.DELIVERED;

  const timelineData = useMemo(() => {
    if (!timelineRawData) return [];

    return timelineRawData.map((item) => [
      format(new Date(item.timestamp), "Pp"),
      item.status,
      item.location,
    ]);
  }, [timelineRawData]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <AppHeaderTitle title="" />,
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
            title={
              mappedPackageData?.courierName || mappedPackageData
                ? `${mappedPackageData?.trackingId || id}`
                : "Package Not Found"
            }
          />
        </View>
      ),
      headerRight: () => {
        return (
          <View style={{ flexDirection: "row", gap: mvs(10) }}>
            {mappedPackageData?.type === PACKAGE_TYPE.INCOMING && (
              <Feather name="phone" size={24} color="black" />
            )}
            {mappedPackageData?.type === PACKAGE_TYPE.OUTGOING && (
              <Chip
                label={mappedPackageData.package_status}
                size="small"
                variant="info"
              />
            )}
          </View>
        );
      },
    });
  }, [mappedPackageData, navigation, id]);

  const onCloseReportModal = () => {
    setIsReportModalOpen(false);
  };

  const handleReportIssue = useCallback(() => {
    setIsReportModalOpen(true);
  }, []);

  const onSubmitReport = handleSubmit(async (data: any) => {
    console.log("report form data: ", data);
    onCloseReportModal();
  });

  const handleCloseModal = useCallback(() => {
    if (videoPlayer) {
      try {
        videoPlayer.pause();
        videoPlayer.currentTime = 0;
        // Optional: mute it as well
        videoPlayer.muted = true;
      } catch (error) {
        console.error("Error resetting video player:", error);
      }
    }
    setModalVisible(false);
  }, [videoPlayer]);

  if (detailsLoading && !packageData) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: mvs(30) }}>
          <View style={{ height: 180, backgroundColor: Colors.border, borderRadius: 16, opacity: 0.3, marginBottom: 20 }} />
          <View style={{ marginBottom: 20 }}>
            <Skeleton width="40%" height={24} style={{ marginBottom: 8 }} />
            <Skeleton width="100%" height={16} />
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
            <Skeleton width="45%" height={60} variant="rounded" />
            <Skeleton width="45%" height={60} variant="rounded" />
            <Skeleton width="45%" height={60} variant="rounded" />
            <Skeleton width="45%" height={60} variant="rounded" />
          </View>
          <Skeleton width="30%" height={24} style={{ marginBottom: 12 }} />
          <Skeleton width="100%" height={80} variant="rounded" />
        </ScrollView>
      </View>
    );
  }

  if (!packageData || !mappedPackageData) {
    return (
      <View style={styles.centerContainer}>
        <Text>Package not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: mvs(30) }}
      >
        <PackageDetailsHeader packageData={mappedPackageData as any} />

        <SpecificInfoSection
          title="Assigned QR Code"
          description="QR Code"
          value={mappedPackageData.qrCode}
        />

        <PackageDetailsAttribute attributes={mappedPackageData.attributes} />

        <PackageDetailsDescription description={mappedPackageData.description} />

        {timelineLoading ? (
          <View style={{ marginTop: 20 }}>
            <Skeleton width="30%" height={24} style={{ marginBottom: 12 }} />
            <Skeleton width="100%" height={80} variant="rounded" />
          </View>
        ) : (
          (mappedPackageData.type !== PACKAGE_TYPE.OUTGOING ||
            mappedPackageData.shipment_status === "Send") && (
            <PackageDetailsTimeLine timelineData={timelineData} />
          )
        )}

        {/* ✅ Only show video button for delivered packages */}
        {shouldShowVideo && (
          <View>
            <Button
              title="View Recording"
              textStyle={{ color: Colors.primary }}
              icon={<RecordingIcon width={24} height={24} />}
              style={{
                backgroundColor: Colors.background,
                marginTop: mvs(Spacing.xs),
                borderWidth: 1,
                borderColor: Colors.border,
              }}
              onPress={() => setModalVisible(true)}
            />

            <SpecificInfoSection
              title="Returning PIN"
              description="PIN Code"
              value={mappedPackageData.qrCode}
            />
          </View>
        )}
      </ScrollView>

      {mappedPackageData.type === PACKAGE_TYPE.INCOMING && (
        <View style={styles.footer}>
          <Button
            title="Report an Issue"
            variant="danger"
            onPress={handleReportIssue}
            icon={<ReportIcon />}
            iconPosition="left"
          />
        </View>
      )}

      {isReportModalOpen && (
        <PackageReportModal
          control={control}
          isReportModalOpen={isReportModalOpen}
          onCloseReportModal={onCloseReportModal}
          onSubmitReport={onSubmitReport}
        />
      )}

      {/* Video Recording Modal - only render when visible and video is available */}
      {shouldShowVideo && modalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: mvs(10),
                }}
              >
                <View />
                <Ionicons
                  name="close-outline"
                  size={24}
                  color="black"
                  onPress={handleCloseModal}
                />
              </View>
              <VideoRecording player={videoPlayer} autoPlay={true} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: mvs(30),
  },
  scrollView: {
    padding: mvs(20),
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    width: "100%",
    padding: mvs(Spacing.lg),
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "100%",
    maxWidth: 500,
    overflow: "hidden",
  },
});

export default PackageDetails;
