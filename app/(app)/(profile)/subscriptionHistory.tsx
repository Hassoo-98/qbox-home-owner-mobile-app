import { Button, EmptyState, SubscriptionHistoryItem, SubscriptionHistoryItemSkeleton } from "@/components";
import { Spacing } from "@/constants";
import { useSubscriptions } from "@/hooks/api/useHomeQueries";
import { mvs } from "@/utils/metrices";
import { router } from "expo-router";
import { FlatList, View } from "react-native";

export const SubscriptionHistory = () => {
  const { data: subscriptionsData, isLoading } = useSubscriptions();

  return (
    <View
      style={{
        flex: 1,
        paddingBottom: mvs(20),
      }}
    >
      {isLoading ? (
        <FlatList
          data={[1, 2, 3]}
          keyExtractor={(item) => item.toString()}
          renderItem={() => <SubscriptionHistoryItemSkeleton />}
          contentContainerStyle={{ padding: mvs(Spacing.lg) }}
          showsVerticalScrollIndicator={false}
        />
      ) : !subscriptionsData || subscriptionsData.length === 0 ? (
        <EmptyState
          title="No Subscription History"
          description="Your payment records and plans will appear here."
          iconName="receipt-outline"
        />
      ) : (
        <FlatList
          data={subscriptionsData}
          keyExtractor={(item) => item?.id?.toString()}
          contentContainerStyle={{ padding: mvs(Spacing.lg) }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <SubscriptionHistoryItem item={item as any} />}
        />
      )}
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
