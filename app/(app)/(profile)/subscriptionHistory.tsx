import { Button, SubscriptionHistoryItem } from "@/components";
import { Spacing, SUBSCRIPTION_HISTORY } from "@/constants";
import { mvs } from "@/utils/metrices";
import { router } from "expo-router";
import { FlatList, View } from "react-native";

export const SubscriptionHistory = () => {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <FlatList
        data={SUBSCRIPTION_HISTORY}
        keyExtractor={(item) => item?.id?.toString()}
        contentContainerStyle={{ padding: mvs(Spacing.lg) }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <SubscriptionHistoryItem item={item} />}
      />
      <View
        style={{
          width: "100%",
          padding: mvs(Spacing.lg),
        }}
      >
        <Button
          title="Renew Subscription"
          onPress={() => router.navigate("/renewSubscription")}
        />
      </View>
    </View>
  );
};

export default SubscriptionHistory;
