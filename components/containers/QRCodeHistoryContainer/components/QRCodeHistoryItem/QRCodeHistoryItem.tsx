import { Card, Chip, Text } from "@/components";
import { Colors, Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import { format } from "date-fns";
import { View } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { SwipeActions } from "./components";
import { useData } from "./hooks";
import { QRCodeHistoryItemProps } from "./props";

export const QRCodeHistoryItem = ({
  item,
  onShare,
  onMarkAsExpire,
}: QRCodeHistoryItemProps) => {
  const { handleMarkAsExpire, handleShare, qrCodeDescription, swipeableRef } =
    useData({
      item,
      onShare,
      onMarkAsExpire,
    });

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={() => (
        <SwipeActions
          handleShare={handleShare}
          handleMarkAsExpire={handleMarkAsExpire}
        />
      )}
      overshootRight={false}
      rightThreshold={40}
    >
      <Card
        variant="filled"
        showSideBorder
        sideBorderColor={item.isActive ? Colors.success : Colors.danger}
        style={{ marginBottom: mvs(Spacing.md) }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontWeight: "bold" }}>{item?.title}</Text>
          <Chip
            variant={item.isActive ? "success" : "error"}
            label={item.isActive ? "Active" : "Expired"}
            size="small"
          />
        </View>
        <Text size="sm">{qrCodeDescription}</Text>
        <Text
          variant="secondary"
          size="sm"
          style={{ marginTop: mvs(Spacing.sm) }}
        >
          {format(item?.createdAt, "Pp")}
        </Text>
      </Card>
    </Swipeable>
  );
};

export default QRCodeHistoryItem;
