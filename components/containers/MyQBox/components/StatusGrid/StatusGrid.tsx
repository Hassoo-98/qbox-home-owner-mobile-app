import { CameraIcon, LED_IndicatorIcon, OnlineStatusIcon, PowerStatusIcom } from "@/assets/icons";
import { AttributeView } from "@/components";
import { Colors } from "@/constants";
import { mvs } from "@/utils/metrices";
import { StyleSheet, View } from "react-native";

export const StatusCardsGrid = ({ qboxesDetails }: { qboxesDetails: any }) => {

  console.log("homeOwnerResponse", JSON.stringify(qboxesDetails, null, 4));

  const details = Array.isArray(qboxesDetails) ? qboxesDetails[0] : qboxesDetails;

  const STATUS_CARDS_DATA = [
    {
      id: "1",
      icon: OnlineStatusIcon,
      title: "QBox Status",
      statusText: details?.status || "Offline",
      statusColor: details?.status === "Online" ? Colors.success : Colors.danger,
    },
    {
      id: "2",
      icon: CameraIcon,
      title: "Camera",
      statusText: details?.camera_status || "Not Working",
      statusColor: details?.camera_status === "Working" ? Colors.success : Colors.danger,
    },
    {
      id: "3",
      icon: LED_IndicatorIcon,
      title: "LED Indicator",
      statusText: details?.led_indicator || "Red",
      statusColor: details?.led_indicator === "Green" ? Colors.success : Colors.danger,
    },
    {
      id: "4",
      icon: PowerStatusIcom,
      title: "Power Status",
      statusText: details?.power_status || "Unplugged",
      statusColor: details?.power_status === "Plugged" ? Colors.success : Colors.danger,
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
