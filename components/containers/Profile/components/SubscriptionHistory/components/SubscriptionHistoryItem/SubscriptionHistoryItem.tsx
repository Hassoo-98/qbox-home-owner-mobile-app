import { Button, Card, Text } from "@/components";
import { Colors, Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { router } from "expo-router";
import { View } from "react-native";
import { SubscriptionHistoryItemProps } from "./props";

export const SubscriptionHistoryItem = ({
  item,
}: SubscriptionHistoryItemProps) => {
  const handleCardPress = () => {
    router.navigate(`/qrCodeDetails/${item.id}`);
  };

  return (
    <Card
      variant="filled"
      showSideBorder
      sideBorderColor={Colors.success}
      style={{ marginBottom: mvs(Spacing.md) }}
      onPress={handleCardPress}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontWeight: "bold" }}>{item?.title}</Text>
        <Text
          style={{ fontWeight: "bold" }}
        >{`${item?.currency} ${item?.amount}`}</Text>
      </View>
      <Text size="sm">{item?.paymentMethod}</Text>
      <Text
        variant="secondary"
        size="sm"
        style={{ marginTop: mvs(Spacing.sm) }}
      >
        {item?.transactionId}
      </Text>
      <Text
        variant="secondary"
        size="sm"
        style={{ marginTop: mvs(Spacing.sm) }}
      >
        {format(item?.startDate, "Pp")} till {format(item?.endDate, "Pp")}
      </Text>

      <Button
        title="Download Invoice"
        textStyle={{ color: Colors.primary }}
        icon={
          <MaterialCommunityIcons
            name="arrow-collapse-down"
            color={Colors.primary}
            size={18}
          />
        }
        style={{
          backgroundColor: Colors.darkGray,
          marginTop: mvs(Spacing.xs),
        }}
        onPress={() => {}}
      />
    </Card>
  );
};

export default SubscriptionHistoryItem;
