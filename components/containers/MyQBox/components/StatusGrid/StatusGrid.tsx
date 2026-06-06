import { CameraIcon, OnlineStatusIcon } from "@/assets/icons";
import { AttributeView } from "@/components";
import { Colors } from "@/constants";
import { useLocale } from "@/hooks";
import { useDeviceStatusSocket } from "@/hooks/api/useQBoxQueries";
import { mvs } from "@/utils/metrices";
import { StyleSheet, View } from "react-native";

export const StatusCardsGrid = ({ qboxesDetails }: { qboxesDetails: any }) => {
  const { t } = useLocale();
  const details = Array.isArray(qboxesDetails) ? qboxesDetails[0] : qboxesDetails;
  const qboxId = details?.qbox_id;
  const { data: deviceStatus, isConnecting } = useDeviceStatusSocket(qboxId);

  const normalizeStatus = (value?: string | null, fallback = t("unknown")) => {
    if (typeof value !== "string") return fallback;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : fallback;
  };

  const getTone = (value: string, activeValue: string) => {
    const normalized = value.toLowerCase();
    if (normalized === "connecting..." || normalized === t("connectingNow").toLowerCase()) return Colors.warning;
    if (normalized === activeValue.toLowerCase()) return Colors.success;
    return isConnecting && !deviceStatus ? Colors.warning : Colors.danger;
  };

  const internalCameraStatus = normalizeStatus(
    deviceStatus?.internal_camera_status,
    isConnecting ? t("connectingNow") : t("notWorking")
  );
  const externalCameraStatus = normalizeStatus(
    deviceStatus?.external_camera_status,
    isConnecting ? t("connectingNow") : t("notWorking")
  );
  const qboxStatus = normalizeStatus(
    deviceStatus?.qbox_status ?? deviceStatus?.status,
    isConnecting ? t("connectingNow") : t("disconnected")
  );
  const alarmStatus =
    isConnecting && !deviceStatus ? t("connectingNow") : deviceStatus?.alarm_active ? t("active") : t("inactive");

  const STATUS_CARDS_DATA = [
    {
      id: "1",
      icon: OnlineStatusIcon,
      title: t("qboxStatus"),
      statusText: qboxStatus,
      statusColor: getTone(qboxStatus, t("connected")),
    },
    {
      id: "2",
      icon: CameraIcon,
      title: t("internalCamera"),
      statusText: internalCameraStatus,
      statusColor: getTone(internalCameraStatus, t("working")),
    },
    {
      id: "3",
      icon: CameraIcon,
      title: t("externalCamera"),
      statusText: externalCameraStatus,
      statusColor: getTone(externalCameraStatus, t("working")),
    },
    {
      id: "4",
      icon: CameraIcon,
      title: t("alarm"),
      statusText: alarmStatus,
      statusColor:
        isConnecting && !deviceStatus ? Colors.warning : deviceStatus?.alarm_active ? Colors.warning : Colors.success,
    },
  ];
  return (
    <View style={styles.container}>
      {STATUS_CARDS_DATA.map((item) => (
        <AttributeView key={item.id} item={item} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "90%",
    gap: mvs(12),
    justifyContent: "space-between",
  },
});
