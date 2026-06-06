import { RecordingIcon, WarningIconOutline } from "@/assets/icons";
import {
  AppHeaderLeft,
  AppHeaderTitle,
  Button,
  Chip,
  PackageDetailsAttribute,
  PackageDetailsDescription,
  PackageDetailsHeader,
  PackageDetailsPaymentSummary,
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
import {
  useDeliveredPackagesDetails,
  useIncomingPackagesDetails,
  useOutgoingPackagesDetails,
  usePackageTimeline
} from "@/hooks/api/useShipmentQueries";
import { useLocale } from "@/hooks";
import { reportIssue } from "@/services/api/modules/shipment";
import { CreateReportPayload, PackageTimelineItem } from "@/services/api/types";
import { mvs } from "@/utils/metrices";
import { Feather, Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useVideoPlayer } from "expo-video";
import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useEffect,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { Alert, Linking, Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";

export const PackageDetails = () => {
  const { t } = useLocale();
  const { id, type } = useLocalSearchParams<{ id: string; type: string }>();
  const navigation = useNavigation();
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const isIncomingSingleView = type?.toLowerCase() === PACKAGE_TYPE.INCOMING.toLowerCase();
  const isOutgoingSingleViewRoute = type?.toLowerCase() === PACKAGE_TYPE.OUTGOING.toLowerCase();

  const incomingDetails = useIncomingPackagesDetails(id || "");
  const outgoingDetails = useOutgoingPackagesDetails(id || "");
  const deliveredDetails = useDeliveredPackagesDetails(id || "");

  const activeDetails = useMemo(() => {
    switch (type) {
      case PACKAGE_TYPE.INCOMING.toLowerCase():
        return incomingDetails;
      case PACKAGE_TYPE.OUTGOING.toLowerCase():
        return outgoingDetails;
      case PACKAGE_TYPE.DELIVERED.toLowerCase():
        return deliveredDetails;
      default:
        return { data: null, isLoading: false, error: null };
    }
  }, [type, incomingDetails, outgoingDetails, deliveredDetails]);

  const { data: response, isLoading: detailsLoading } = activeDetails;

  // Normalize response data: some might be wrapped in .data, some not
  const rawPackageData = useMemo(() => {
    if (!response) return null;
    // Check if it's the wrapped format (like outgoing) or direct (like incoming/delivered)
    // If it has 'data' and NO 'id' at the top level, it's likely wrapped
    if ("data" in response && response.data && !("id" in response)) {
      return response.data;
    }
    return response;
  }, [response]);

  const packageData = rawPackageData as any;
  const trackingId = packageData?.trackingId || packageData?.tracking_id;
  const { data: timelineRawData, isLoading: timelineLoading } = usePackageTimeline(trackingId);

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      reportDescription: "",
      trackingId: "",
      issueRelatedTo: "",
    },
  });

  useEffect(() => {
    if (trackingId) {
      reset({
        reportDescription: "",
        trackingId,
        issueRelatedTo: "",
      });
    }
  }, [reset, trackingId]);

  // ✅ ALWAYS call the hook - no conditions before it
  const videoPlayer = useVideoPlayer(
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    (player) => {
      player.loop = false;
      player.muted = false;
    }
  );

  // Map new data structure to UI expectations
  const packageDetails = useMemo(() => {
    if (!packageData) return null;

    if (isIncomingSingleView) {
      const serviceProviderName = packageData.service_provider_name
        || packageData.service_provider?.name
        || "not accepted from service_provider yet";
      const serviceProviderPhone = packageData.service_provider?.phone_number || "";
      const senderHomeOwnerName = packageData.sender?.home_owner_name
        || packageData.sender_home_owner?.home_owner_name
        || packageData.sender_home_owner?.name
        || "Sender Name";
      const senderPhone = packageData.sender?.home_owner_phone
        || packageData.sender_home_owner?.home_owner_phone
        || packageData.sender_home_owner?.phone_number
        || "";
      const senderEmail = packageData.sender?.home_owner_email
        || packageData.sender_home_owner?.home_owner_email
        || packageData.sender_home_owner?.email
        || "";
      const packageCategory = packageData.package_category
        || packageData.attributes?.find?.((attr: any) => attr.type?.toLowerCase().includes("category"))?.value
        || "N/A";
      const itemValue = packageData.item_value
        || packageData.attributes?.find?.((attr: any) => attr.type?.toLowerCase().includes("value"))?.value
        || "N/A";
      const packageWeight = packageData.package_weight
        || packageData.attributes?.find?.((attr: any) => attr.type?.toLowerCase().includes("weight"))?.value
        || "N/A";

      return {
        ...packageData,
        trackingId: packageData.tracking_id,
        tracking_id: packageData.tracking_id,
        courierName: serviceProviderName,
        serviceProviderPhone,
        senderName: senderHomeOwnerName,
        sender_name: senderHomeOwnerName,
        phoneNumber: senderPhone,
        email: senderEmail,
        lastUpdate: packageData.last_update ? new Date(packageData.last_update) : new Date(),
        createdAt: packageData.created_at ? new Date(packageData.created_at) : new Date(),
        type: PACKAGE_TYPE.INCOMING,
        status: packageData.shipment_status,
        qrCode: packageData.qr_code || packageData.assigned_qr_code?.[0]?.qr_code_id || packageData.package_id || packageData.tracking_id || "",
        qrCodeId: packageData.assigned_qr_code?.[0]?.qr_code_id || packageData.package_id || packageData.tracking_id || "",
        description: packageData.description || "No description available",
        attributes: [
          { type: "Package Category", value: packageCategory },
          { type: "Item Value", value: `${itemValue}` },
          { type: "Package Weight", value: `${packageWeight}`.includes("kg") ? `${packageWeight}` : `${packageWeight} kg` },
        ],
        imageUrl: packageData.package_image || packageData.imageUrl || "",
        paymentSummary: packageData.payment_summary || packageData.paymentSummary || null,
      };
    }

    return {
      ...packageData,
      trackingId: packageData.trackingId || packageData.tracking_id,
      courierName: packageData.courierName || packageData.merchant_name || packageData.service_provider?.name || packageData.service_provider_name,
      serviceProviderPhone: packageData.service_provider?.phone_number || packageData.serviceProviderPhone || "",
      receiverName: packageData.receiver_home_owner?.home_owner_name || packageData.receiver_home_owner?.name || "Receiver Name",
      receiverEmail: packageData.receiver_home_owner?.home_owner_email || packageData.receiver_home_owner?.email || "",
      receiverPhoneNumber: packageData.receiver_home_owner?.home_owner_phone || packageData.receiver_home_owner?.phone_number || "",
      receiver_home_owner: packageData.receiver_home_owner,
      lastUpdate: (packageData.lastUpdate || packageData.last_update) ? new Date(packageData.lastUpdate || packageData.last_update) : new Date(),
      createdAt: (packageData.created_at || packageData.createdAt) ? new Date(packageData.created_at || packageData.createdAt) : new Date(),
      type: PACKAGE_TYPE.OUTGOING,
      status: packageData.status || packageData.shipment_status,
      outgoing_status: packageData.outgoing_status || packageData.shipment_status || "",
      qrCode: packageData.qrCode || packageData.assigned_qr_code?.[0]?.qr_code_id || packageData.package_id || packageData.tracking_id || "",
      qrCodeId: packageData.assigned_qr_code?.[0]?.qr_code_id || packageData.package_id || packageData.tracking_id || "",
      description: packageData.description || "No description available",
      senderName: packageData.receiver_home_owner?.home_owner_name || packageData.receiver_home_owner?.name || "Receiver Name",
      phoneNumber: packageData.receiver_home_owner?.home_owner_phone || packageData.receiver_home_owner?.phone_number || "",
      email: packageData.receiver_home_owner?.home_owner_email || packageData.receiver_home_owner?.email || "",
      attributes: (() => {
        if (isOutgoingSingleViewRoute) {
          const pkgType = packageData.package_category || "N/A";
          const pkgWeight = packageData.package_weight || "N/A";
          const itemValue = packageData.item_value || "N/A";

          return [
            {
              type: "Package Weight",
              value: pkgWeight.toString().includes("kg") ? pkgWeight : `${pkgWeight} kg`,
            },
            { type: "Package Category", value: pkgType },
            { type: "Item Value", value: `${itemValue}` },
          ];
        }

        // Try to get attributes from the array first
        const rawAttributes = packageData.attributes || [];

        if (Array.isArray(rawAttributes)) {
          if (rawAttributes.length > 0) {
            return rawAttributes;
          }
        }

        if (rawAttributes && typeof rawAttributes === "object") {
          const attrs = rawAttributes as Record<string, any>;
          return [
            { type: "Package ID", value: attrs.package_id || packageData.package_id || "N/A" },
            { type: "Package Weight", value: attrs.package_weight || "N/A" },
            { type: "Package Category", value: attrs.package_category || "N/A" },
            { type: "Shipment Category", value: attrs.shipment_category || "N/A" },
            { type: "Item Value", value: attrs.item_value != null ? `${attrs.item_value}` : "N/A" },
            { type: "City", value: attrs.city || "N/A" },
            { type: "Description", value: attrs.description || packageData.description || "N/A" },
          ];
        }

        return [
          { type: "Type", value: packageData.details?.package_type || "N/A" },
          { type: "Size", value: packageData.details?.package_size || "N/A" },
          { type: "Weight", value: packageData.details?.package_weight || "N/A" },
        ];
      })(),
      imageUrl: packageData.imageUrl || packageData.package_image || "",
      paymentSummary: packageData.paymentSummary || packageData.payment_summary
        ? {
            paymentMethod: packageData.paymentSummary?.paymentMethod
              || packageData.payment_summary?.payment_method
              || "Payment",
            charges: packageData.paymentSummary?.charges || packageData.payment_summary?.charges || [],
            currency: packageData.paymentSummary?.currency
              || packageData.payment_summary?.currency
              || "SAR",
          }
        : null,
    };
  }, [isIncomingSingleView, isOutgoingSingleViewRoute, packageData]);

  // Determine if we should show video features
  const shouldShowVideo = !!packageDetails && packageDetails.type === PACKAGE_TYPE.DELIVERED;
  const outgoingStatus = packageDetails?.outgoing_status || "";

  const timelineData = useMemo(() => {
    if (!timelineRawData) return [];

    return timelineRawData.map((item: PackageTimelineItem) => [
      format(new Date(item.dateAndTime || item.date_and_time || ""), "MM/dd/yy  h:mma").toLowerCase(),
      item.status,
      item.package_city || item.city || item.location,
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
              <AppHeaderTitle title={packageDetails?.trackingId ? `${packageDetails.trackingId}` : t("packageNotFound")} />
        </View>
      ),
      headerRight: () => {
        return (
          <View style={{ flexDirection: "row", gap: mvs(10) }}>
            {packageDetails?.type === PACKAGE_TYPE.INCOMING && (
              <Pressable
                onPress={() => {
                  const phone = packageDetails?.serviceProviderPhone;
                  if (phone) {
                    Linking.openURL(`tel:${phone}`);
                  }
                }}
                hitSlop={10}
              >
                <Feather name="phone" size={24} color="black" />
              </Pressable>
            )}
            {packageDetails?.type === PACKAGE_TYPE.OUTGOING && (
              <Chip
                label={outgoingStatus}
                size="small"
                variant={
                  outgoingStatus.toLowerCase().includes("sent") ||
                    outgoingStatus.toLowerCase().includes("send")
                    ? "warning"
                    : "info"
                }
              />
            )}
          </View>
        );
      },
    });
  }, [packageDetails, navigation, outgoingStatus, t]);

  const onCloseReportModal = () => {
    setIsReportModalOpen(false);
  };

  const handleReportIssue = useCallback(() => {
    setIsReportModalOpen(true);
  }, []);

  const onSubmitReport = handleSubmit(async (data: any) => {
    try {
      const payload: CreateReportPayload = {
        tracking_id: data.trackingId,
        status: "Issue Logged",
        description: data.reportDescription,
        issue_related_to: data.issueRelatedTo,
        location: packageData?.pickup_address?.short_address
          || packageData?.delivery_address?.short_address
          || "Main Gate",
      };

      const response = await reportIssue(payload);

      if (response.success) {
        Alert.alert("Success", "Issue reported successfully");
        onCloseReportModal();
      } else {
        Alert.alert("Error", response.message || "Failed to report issue");
      }
    } catch (error: any) {
      Alert.alert("Error", error?.response?.data?.message || "Something went wrong while reporting the issue");
      console.error("report issue error: ", error);
    }
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

  if (!packageData || !packageDetails) {
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
        <PackageDetailsHeader packageData={packageDetails as any} />

        <PackageDetailsAttribute attributes={packageDetails.attributes} />

        <SpecificInfoSection
          title="Assigned QR Code"
          description="QR Code"
          value={packageDetails.qrCodeId || packageDetails.qrCode}
        />

            <PackageDetailsDescription description={packageDetails.description} />

        {packageDetails.paymentSummary && !isIncomingSingleView && (
          <PackageDetailsPaymentSummary paymentSummary={packageDetails.paymentSummary} />
        )}
            {timelineLoading ? (
              <View style={{ marginTop: 20 }}>
                <Skeleton width="30%" height={24} style={{ marginBottom: 12 }} />
                <Skeleton width="100%" height={80} variant="rounded" />
              </View>
            ) : (
              <PackageDetailsTimeLine timelineData={timelineData} />
            )}

        {/* ✅ Only show video button for delivered packages */}
        {shouldShowVideo && (
              <View>
                <Button
                  title={t("viewRecording")}
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
                  title={t("pinCode")}
                  description={t("pinCode")}
                  value={packageDetails.qrCode}
                />
              </View>
            )}
      </ScrollView>

      {packageDetails.type === PACKAGE_TYPE.INCOMING && (
        <View style={styles.footer}>
          <Button
            title={t("reportAnIssue")}
            variant="danger"
            onPress={handleReportIssue}
            icon={<WarningIconOutline />}
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
