import { Card, Chip, Text } from "@/components";
import { Colors, Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import { format } from "date-fns";
import { router } from "expo-router";
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

  const handleCardPress = () => {
    router.navigate(`/qrCodeDetails/${item.id}`);
  };

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
        sideBorderColor={item.status === "Active" ? Colors.success : Colors.danger}
        style={{ marginBottom: mvs(Spacing.md) }}
        onPress={handleCardPress}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontWeight: "bold" }}>{item?.name}</Text>
          <Chip
            variant={item.status === "Active" ? "success" : "error"}
            label={item.status}
            size="small"
          />
        </View>
        <Text size="sm">{qrCodeDescription}</Text>
        <Text
          variant="secondary"
          size="sm"
          style={{ marginTop: mvs(Spacing.sm) }}
        >
          {item?.created_at ? format(new Date(item.created_at), "Pp") : "N/A"}
        </Text>
      </Card>
    </Swipeable>
  );
};

export default QRCodeHistoryItem;
