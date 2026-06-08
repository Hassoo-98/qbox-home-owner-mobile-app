import {
  Card,
  EmptyState,
  SegmentedControl,
  Text,
} from "@/components";
import { BorderRadius, Colors, Spacing } from "@/constants";
import { useAuth } from "@/hooks";
import {
  useNotificationFeed,
  useMarkAllNotificationsAsRead,
} from "@/hooks/api/useNotificationQueries";
import * as NotificationService from "@/services/api/modules/notification";
import { NotificationCategory } from "@/services/api/types";
import { queryClient } from "@/utils/queryClient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";

const NOTIFICATION_TABS = [
  { label: "All", value: "all" },
  { label: "shipments", value: "shipments" },
  { label: "Qbox", value: "qbox" },
  { label: "Accounts", value: "accounts" },
  { label: "Billing", value: "billing" },
] as const;

type NotificationTabValue = (typeof NOTIFICATION_TABS)[number]["value"];

const TAB_META: Record<
  Exclude<NotificationTabValue, "all">,
  { label: string; color: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  qbox: {
    label: "Qbox",
    color: "#28475C",
    icon: "hardware-chip-outline",
  },
  billing: {
    label: "Billing",
    color: "#D97706",
    icon: "card-outline",
  },
  accounts: {
    label: "Accounts",
    color: "#7C3AED",
    icon: "person-circle-outline",
  },
};

const getNotificationCategory = (
  notification: ReturnType<typeof NotificationService.normalizeNotificationForUI>
): NotificationCategory => {
  const explicit = String(notification.category || "").toLowerCase();

  if (explicit === "shipments" || explicit === "shipment") {
    return "shipments";
  }

  if (explicit === "qbox" || explicit === "billing" || explicit === "accounts") {
    return explicit as NotificationCategory;
  }

  return NotificationService.deriveNotificationCategory(notification);
};

const formatTime = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

export default function NotificationScreen() {
  const { user, isLoading: authLoading } = useAuth();
  const homeOwnerId = user?.id;
  const [activeTab, setActiveTab] = useState<NotificationTabValue>("all");
  const hasMarkedAllReadRef = useRef(false);
  const markAllReadMutation = useMarkAllNotificationsAsRead(homeOwnerId);

  const {
    notifications,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    error,
    refetch,
    isRefetching,
  } = useNotificationFeed(homeOwnerId);

  useEffect(() => {
    hasMarkedAllReadRef.current = false;
  }, [homeOwnerId]);

  useEffect(() => {
    if (!homeOwnerId || hasMarkedAllReadRef.current) {
      return;
    }

    hasMarkedAllReadRef.current = true;
    void markAllReadMutation.mutateAsync().catch(() => {
      hasMarkedAllReadRef.current = false;
    });
  }, [homeOwnerId, markAllReadMutation]);

  const filteredNotifications = useMemo(() => {
    if (activeTab === "all") {
      return notifications;
    }

    return notifications.filter((notification) => {
      const category = getNotificationCategory(notification);
      return category === activeTab;
    });
  }, [activeTab, notifications]);

  const updateReadState = (notificationId: string) => {
    if (!homeOwnerId) {
      return;
    }

    queryClient.setQueryData(
      NotificationService.notificationQueryKeys.homeOwner(homeOwnerId),
      (current: any) => {
        if (!current?.pages) {
          return current;
        }

        return {
          ...current,
          pages: current.pages.map((page: any) => ({
            ...page,
            items: page.items.map((item: any) =>
              item.id === notificationId ? { ...item, read: true, is_read: true } : item
            ),
          })),
        };
      }
    );
  };

  const handleNotificationPress = (item: ReturnType<
    typeof NotificationService.normalizeNotificationForUI
  >) => {
    updateReadState(item.id);

    const route = NotificationService.resolveNotificationRoute(item);

    if (route) {
      router.push(route);
      return;
    }

    router.push("/notification");
  };

  const renderCard = ({
    item,
  }: {
    item: ReturnType<typeof NotificationService.normalizeNotificationForUI>;
  }) => {
    const category = getNotificationCategory(item);
    const meta =
      category === "shipments"
        ? {
            label: "Shipments",
            color: "#2E7D32",
            icon: "cube-outline" as const,
          }
        : TAB_META[category];
    const isRead = Boolean(item.read);
    const timeLabel = formatTime(item.createdAt);

    return (
      <Card
        onPress={() => handleNotificationPress(item)}
        showSideBorder
        sideBorderColor={meta.color}
        style={[
          styles.card,
          !isRead && styles.unreadCard,
          { borderColor: `${meta.color}22` },
        ]}
        contentStyle={styles.cardContent}
      >
        <View style={styles.cardHeader}>
          <View style={styles.titleRow}>
            <Ionicons name={meta.icon} size={18} color={meta.color} />
            <Text bold size="md" style={styles.cardTitle}>
              {item.title}
            </Text>
          </View>

          {!isRead && <View style={[styles.unreadDot, { backgroundColor: meta.color }]} />}
        </View>

        <Text size="sm" style={styles.cardBody} color={Colors.text}>
          {item.body || "No details available."}
        </Text>

        <View style={styles.cardFooter}>
          <View style={[styles.categoryPill, { backgroundColor: `${meta.color}1A` }]}>
            <Text size="xs" bold color={meta.color}>
              {meta.label}
            </Text>
          </View>

          <Text size="xs" color={Colors.secondaryText}>
            {timeLabel}
          </Text>
        </View>
      </Card>
    );
  };

  if (authLoading && !homeOwnerId) {
    return (
      <View style={styles.centerState}>
        <ActivityIndicator color={Colors.primary} />
        <Text style={styles.stateTitle}>Loading notifications...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerState}>
        <Ionicons name="alert-circle-outline" size={42} color={Colors.danger} />
        <Text style={styles.stateTitle}>Could not load notifications</Text>
        <Text style={styles.stateDescription}>
          {error instanceof Error ? error.message : "Please check your connection and try again."}
        </Text>

        <Pressable
          style={styles.retryButton}
          onPress={() => {
            void refetch();
          }}
        >
          <Text bold color={Colors.white}>
            Retry
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={filteredNotifications}
      keyExtractor={(item) => item.id}
      renderItem={renderCard}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
      onEndReachedThreshold={0.35}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      }}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />
      }
      ListHeaderComponent={
        <View style={styles.header}>
          <View style={styles.heroCard}>
            <Text size="lg" bold style={styles.headerTitle}>
              Notifications
            </Text>
            <Text size="sm" color={Colors.secondaryText} style={styles.headerSubtitle}>
              Stay up to date with shipment activity, QBox alerts, billing updates, and account changes.
            </Text>
          </View>

          <SegmentedControl
            options={NOTIFICATION_TABS.map((tab) => ({
              label: tab.label,
              value: tab.value,
            }))}
            value={activeTab}
            onChange={(value) => setActiveTab(value as NotificationTabValue)}
            style={styles.segmentedControl}
          />
        </View>
      }
      ListEmptyComponent={
        isLoading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator color={Colors.primary} />
            <Text style={styles.stateDescription}>Fetching your notifications...</Text>
          </View>
        ) : (
          <EmptyState
            title="No notifications yet"
            description="When your QBox, shipments, or billing updates arrive, they'll show up here."
            iconName="notifications-outline"
            containerStyle={styles.emptyState}
          />
        )
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <View style={styles.footerLoader}>
            <ActivityIndicator color={Colors.primary} />
          </View>
        ) : null
      }
      contentInsetAdjustmentBehavior="automatic"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.gray,
    flexGrow: 1,
  },
  header: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  heroCard: {
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    shadowColor: Colors.dark,
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  headerTitle: {
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    lineHeight: 20,
  },
  segmentedControl: {
    marginTop: 2,
  },
  card: {
    marginBottom: Spacing.sm,
    borderWidth: 1,
  },
  unreadCard: {
    backgroundColor: "#FFFDF7",
  },
  cardContent: {
    padding: Spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  titleRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  cardTitle: {
    flex: 1,
    color: Colors.text,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginTop: 4,
  },
  cardBody: {
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.sm,
  },
  categoryPill: {
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
  },
  emptyState: {
    marginTop: Spacing.xl,
  },
  loadingState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },
  footerLoader: {
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xl,
    gap: Spacing.sm,
    backgroundColor: Colors.gray,
  },
  stateTitle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  stateDescription: {
    textAlign: "center",
    color: Colors.secondaryText,
    lineHeight: 20,
  },
  retryButton: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
  },
});
