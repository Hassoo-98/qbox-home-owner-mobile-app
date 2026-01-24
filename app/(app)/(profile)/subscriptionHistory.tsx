import { Button, SubscriptionHistoryItem } from "@/components";
import { Colors, Spacing } from "@/constants";
import { useSubscriptions } from "@/hooks/api/useHomeQueries";
import { mvs } from "@/utils/metrices";
import { router } from "expo-router";
import { ActivityIndicator, FlatList, View } from "react-native";

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
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: Spacing.xl }} />
      ) : (
        <FlatList
          data={subscriptionsData || []}
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
