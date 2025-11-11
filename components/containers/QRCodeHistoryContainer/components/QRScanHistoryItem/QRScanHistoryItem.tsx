import { RecordingIcon } from "@/assets/icons";
import { Button, Card, Chip, Text } from "@/components";
import { Colors, Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import { format } from "date-fns";
import { View } from "react-native";
import { QRScanHistoryItemProps } from "./props";

export const QRScanHistoryItem = ({ item }: QRScanHistoryItemProps) => {
  return (
    <Card
      variant="filled"
      showSideBorder
      sideBorderColor={
        item.status === "success" ? Colors.success : Colors.danger
      }
      style={{ marginBottom: mvs(Spacing.md) }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          ...(item?.status === "success" && {
            borderBottomWidth: 1,
            borderColor: Colors.border2,
            paddingBottom: mvs(Spacing.sm),
          }),
        }}
      >
        <Text style={{ fontWeight: "bold" }}>
          {item?.qrCodeScanUser || "Unknown "}
        </Text>
        <Chip
          variant={item.status === "success" ? "success" : "error"}
          label={item.status === "success" ? "Success" : "Failed"}
          size="small"
        />
      </View>
      {item?.status === "success" && (
        <>
          <View style={{ paddingVertical: mvs(Spacing.sm) }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text size="md" variant="secondary">
                Locker Opened
              </Text>
              <Text size="md" variant="secondary">
                {format(item?.openedAt, "Pp")}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text size="md" variant="secondary">
                Locker Closed
              </Text>
              <Text size="md" variant="secondary">
                {format(item?.closedAt, "Pp")}
              </Text>
            </View>
          </View>
          <Button
            title="View Recording"
            textStyle={{ color: Colors.primary }}
            icon={<RecordingIcon width={24} height={24} />}
            style={{
              backgroundColor: Colors.darkGray,
              marginTop: mvs(Spacing.xs),
            }}
          />
        </>
      )}
    </Card>
  );
};

export default QRScanHistoryItem;
