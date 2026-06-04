import { CameraIcon, OnlineStatusIcon } from "@/assets/icons";
import { AttributeView } from "@/components";
import { Colors } from "@/constants";
import { useDeviceStatusSocket } from "@/hooks/api/useQBoxQueries";
import { mvs } from "@/utils/metrices";
import { StyleSheet, View } from "react-native";

export const StatusCardsGrid = ({ qboxesDetails }: { qboxesDetails: any }) => {
  const details = Array.isArray(qboxesDetails) ? qboxesDetails[0] : qboxesDetails;
  const qboxId = details?.qbox_id;
  const { data: deviceStatus, isConnecting } = useDeviceStatusSocket(qboxId);

  const normalizeStatus = (value?: string | null, fallback = "Unknown") => {
    if (typeof value !== "string") return fallback;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : fallback;
  };

  const getTone = (value: string, activeValue: string) => {
    const normalized = value.toLowerCase();
    if (normalized === "connecting...") return Colors.warning;
    if (normalized === activeValue.toLowerCase()) return Colors.success;
    return isConnecting && !deviceStatus ? Colors.warning : Colors.danger;
  };

  const internalCameraStatus = normalizeStatus(
    deviceStatus?.internal_camera_status,
    isConnecting ? "Connecting..." : "Not Working"
  );
  const externalCameraStatus = normalizeStatus(
    deviceStatus?.external_camera_status,
    isConnecting ? "Connecting..." : "Not Working"
  );
  const qboxStatus = normalizeStatus(
    deviceStatus?.qbox_status ?? deviceStatus?.status,
    isConnecting ? "Connecting..." : "Offline"
  );
  const alarmStatus = isConnecting && !deviceStatus ? "Connecting..." : deviceStatus?.alarm_active ? "Active" : "Inactive";

  const STATUS_CARDS_DATA = [
    {
      id: "1",
      icon: OnlineStatusIcon,
      title: "QBox Status",
      statusText: qboxStatus,
      statusColor: getTone(qboxStatus, "Online"),
    },
    {
      id: "2",
      icon: CameraIcon,
      title: "Internal Camera",
      statusText: internalCameraStatus,
      statusColor: getTone(internalCameraStatus, "Working"),
    },
    {
      id: "3",
      icon: CameraIcon,
      title: "External Camera",
      statusText: externalCameraStatus,
      statusColor: getTone(externalCameraStatus, "Working"),
    },
    {
      id: "4",
      icon: CameraIcon,
      title: "Alarm",
      statusText: alarmStatus,
      statusColor: isConnecting && !deviceStatus ? Colors.warning : deviceStatus?.alarm_active ? Colors.warning : Colors.success,
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
