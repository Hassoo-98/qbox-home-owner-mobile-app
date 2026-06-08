import * as Notification from "@/services/api/modules/notification";
import {
  Notification as NotificationItem,
  RegisterDeviceTokenPayload,
} from "@/services/api/types";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export const useHomeOwnerNotifications = (homeOwnerId?: string | null) => {
  return useInfiniteQuery({
    queryKey: homeOwnerId
      ? Notification.notificationQueryKeys.homeOwner(homeOwnerId)
      : Notification.notificationQueryKeys.all,
    enabled: Boolean(homeOwnerId),
    initialPageParam: null as string | number | null,
    queryFn: ({ pageParam }) =>
      Notification.getHomeOwnerNotifications(homeOwnerId as string, pageParam),
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
    staleTime: 30_000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });
};

export const useNotificationFeed = (homeOwnerId?: string | null) => {
  const query = useHomeOwnerNotifications(homeOwnerId);

  const notifications = useMemo(() => {
    const nextNotifications =
      query.data?.pages.flatMap((page) =>
        page.items.map((item) => Notification.normalizeNotificationForUI(item))
      ) ?? [];

    return [...nextNotifications].sort((left, right) => {
      const leftTime = new Date(left.createdAt || 0).getTime();
      const rightTime = new Date(right.createdAt || 0).getTime();

      return rightTime - leftTime;
    });
  }, [query.data]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );

  return {
    ...query,
    notifications,
    unreadCount,
  };
};

export const useRegisterDeviceToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterDeviceTokenPayload) =>
      Notification.registerDeviceToken(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: Notification.notificationQueryKeys.all,
      });
    },
  });
};

export const useSendAlert = () => {
  return useMutation({
    mutationFn: (data: { title: string; body: string; user_id: string }) =>
      Notification.sendAlert(data),
  });
};

export const useMarkAllNotificationsAsRead = (homeOwnerId?: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!homeOwnerId) {
        throw new Error("Missing home owner id");
      }

      return Notification.markAllNotificationsAsRead(homeOwnerId);
    },
    onSuccess: () => {
      if (!homeOwnerId) {
        return;
      }

      queryClient.setQueryData(
        Notification.notificationQueryKeys.homeOwner(homeOwnerId),
        (current: any) => {
          if (!current?.pages) {
            return current;
          }

          return {
            ...current,
            pages: current.pages.map((page: any) => ({
              ...page,
              items: page.items.map((item: any) => ({
                ...item,
                read: true,
                is_read: true,
                unread: false,
              })),
            })),
          };
        }
      );

      queryClient.invalidateQueries({
        queryKey: Notification.notificationQueryKeys.homeOwner(homeOwnerId),
      });
    },
  });
};

export const useNotificationListKey = (homeOwnerId?: string | null) =>
  homeOwnerId
    ? Notification.notificationQueryKeys.homeOwner(homeOwnerId)
    : Notification.notificationQueryKeys.all;

export const useUnreadNotificationCount = (homeOwnerId?: string | null) => {
  const { unreadCount } = useNotificationFeed(homeOwnerId);
  return unreadCount;
};

export const useRefreshNotificationCache = () => {
  const queryClient = useQueryClient();

  return (homeOwnerId?: string | null) => {
    if (!homeOwnerId) {
      return;
    }

    queryClient.invalidateQueries({
      queryKey: Notification.notificationQueryKeys.homeOwner(homeOwnerId),
    });
  };
};

export const prependNotificationToCache = (
  queryClient: ReturnType<typeof useQueryClient>,
  homeOwnerId: string,
  item: NotificationItem
) => {
  const normalized = Notification.normalizeNotificationForUI(item);
  const key = Notification.notificationQueryKeys.homeOwner(homeOwnerId);

  queryClient.setQueryData(key, (current: any) => {
    if (!current?.pages) {
      return {
        pages: [
          {
            items: [normalized],
            count: 1,
            next: null,
            previous: null,
            hasMore: false,
            raw: null,
          },
        ],
        pageParams: [null],
      };
    }

    const pages = [...current.pages];
    const firstPage = pages[0] ?? {
      items: [],
      count: 0,
      next: null,
      previous: null,
      hasMore: false,
      raw: null,
    };

    const existingIndex = firstPage.items.findIndex(
      (entry: NotificationItem) => entry.id === normalized.id
    );

    const nextItems =
      existingIndex >= 0
        ? firstPage.items.map((entry: NotificationItem) =>
            entry.id === normalized.id ? normalized : entry
          )
        : [normalized, ...firstPage.items];

    pages[0] = {
      ...firstPage,
      items: nextItems,
      count:
        typeof firstPage.count === "number"
          ? firstPage.count + (existingIndex >= 0 ? 0 : 1)
          : nextItems.length,
    };

    return {
      ...current,
      pages,
    };
  });
};
