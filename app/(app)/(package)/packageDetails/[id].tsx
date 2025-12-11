import { RecordingIcon, ReportIcon } from "@/assets/icons";
import {
  AppHeaderTitle,
  Button,
  PackageDetailsAttribute,
  PackageDetailsDescription,
  PackageDetailsHeader,
  PackageDetailsPaymentSummary,
  PackageDetailsTimeLine,
  PackageReportModal,
  SpecificInfoSection,
  Text,
} from "@/components";
import {
  Colors,
  PACKAGE_DETAILS,
  PACKAGE_TIMELINE,
  PACKAGE_TYPE,
  Spacing,
} from "@/constants";
import { PackageDetailsType } from "@/types";
import { mvs } from "@/utils/metrices";
import { format } from "date-fns";
import { useLocalSearchParams, useNavigation } from "expo-router";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";

export const PackageDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const [packageData, setPackageData] = useState<PackageDetailsType>();
  const [loading, setLoading] = useState<boolean>(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  const { handleSubmit, control } = useForm({
    defaultValues: {
      reportDescription: "",
      trackingId: "",
      reportType: "",
    },
  });

  const timelineData = useMemo(() => {
    if (!id) return [];

    return PACKAGE_TIMELINE.filter(
      (item) => item.packageId.toString() === id
    ).map((item) => [format(item.timestamp, "Pp"), item.status, item.location]);
  }, [id]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const packageDetail = PACKAGE_DETAILS.find(
      (item) => item.id.toString() === id
    );

    if (packageDetail) {
      setPackageData(packageDetail);
    } else {
      console.error("Package not found");
    }

    setLoading(false);
  }, [id]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <AppHeaderTitle
          title={
            packageData?.courierName || packageData
              ? `Package #${packageData.id}`
              : "Package Not Found"
          }
        />
      ),
    });
  }, [packageData, navigation]);

  const onCloseReportModal = () => {
    setIsReportModalOpen(false);
  };

  const handleReportIssue = useCallback(() => {
    setIsReportModalOpen(true);
  }, []);

  const onSubmitReport = handleSubmit(async (data: any) => {
    console.log("report fomr data: ", data);
    onCloseReportModal();
  });

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!packageData) {
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
        <PackageDetailsHeader packageData={packageData} />

        <SpecificInfoSection
          title="Assigned QR Code"
          description="QR Code"
          value={packageData.qrCode}
        />

        <PackageDetailsAttribute attributes={packageData.attributes} />

        <PackageDetailsDescription description={packageData.description} />

        {packageData?.type === PACKAGE_TYPE.OUTGOING &&
          packageData.status === "Send" &&
          packageData.paymentSummary && (
            <PackageDetailsPaymentSummary
              paymentSummary={packageData.paymentSummary}
            />
          )}

        {(packageData?.type !== PACKAGE_TYPE.OUTGOING ||
          packageData?.status === "Send") && (
          <PackageDetailsTimeLine timelineData={timelineData} />
        )}
        {packageData.type === PACKAGE_TYPE.DELIVERED && (
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
            />

            <SpecificInfoSection
              title="Returning PIN"
              description="PIN Code"
              value={packageData.qrCode}
            />
          </View>
        )}
      </ScrollView>

      {packageData.type === PACKAGE_TYPE.INCOMING && (
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
});

export default PackageDetails;
