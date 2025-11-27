import { SubscriptionHistoryItem } from "@/components";
import { SUBSCRIPTION_HISTORY, Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import { FlatList, View } from "react-native";

export const SubscriptionHistory = () => {
  return (
    <View
      style={{
        flex: 1,
        padding: mvs(Spacing.lg),
        marginBottom: mvs(Spacing.lg),
      }}
    >
      <FlatList
        data={SUBSCRIPTION_HISTORY}
        keyExtractor={(item) => item?.id?.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <SubscriptionHistoryItem item={item} />}
      />
    </View>
  );
};

export default SubscriptionHistory;
