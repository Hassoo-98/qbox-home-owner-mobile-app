import { useAuth } from "@/hooks";
import { prependNotificationToCache } from "@/hooks/api/useNotificationQueries";
import * as NotificationService from "@/services/api/modules/notification";
import { queryClient } from "@/utils/queryClient";
import { Notification as NotificationItem } from "@/services/api/types";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { useEffect } from "react";
import { NativeModules, Platform } from "react-native";

const PUSH_TOKEN_STORE_KEY = "device_push_token";
const PUSH_TOKEN_OWNER_KEY = "device_push_token_home_owner_id";

type PushNotificationLike = {
  request: {
    identifier: string;
    content: {
      title?: string | null;
      body?: string | null;
      data?: Record<string, unknown> | null;
    };
  };
};

const getNotificationText = (value: unknown) =>
  typeof value === "string" ? value : "";

const loadNotificationsModule = async () => {
  const hasNativeNotifications =
    Boolean(NativeModules.ExpoNotificationsEmitter) ||
    Boolean(NativeModules.ExpoNotificationsHandlerModule) ||
    Boolean(NativeModules.ExpoPushTokenManager);

  if (!hasNativeNotifications) {
    return null;
  }

  try {
    return await import("expo-notifications");
  } catch (error) {
    console.warn("[notifications] expo-notifications is unavailable", error);
    return null;
  }
};

const buildNotificationFromPush = (
  notification: PushNotificationLike
): NotificationItem => {
  const content = notification.request.content;
  const data = (content.data || {}) as Record<string, unknown>;
  const fallbackId =
    getNotificationText(data.id) ||
    getNotificationText(data.notification_id) ||
    notification.request.identifier ||
    `${Date.now()}`;

  return {
    id: fallbackId,
    title:
      getNotificationText(content.title) ||
      getNotificationText(data.title) ||
      getNotificationText(data.heading),
    body:
      getNotificationText(content.body) ||
      getNotificationText(data.body) ||
      getNotificationText(data.message) ||
      getNotificationText(data.description),
    createdAt:
      getNotificationText(data.createdAt) ||
      getNotificationText(data.created_at) ||
      new Date().toISOString(),
    read: false,
    data,
    payload: data,
    category: getNotificationText(data.category) || getNotificationText(data.type),
    type: getNotificationText(data.type),
    route: getNotificationText(data.route),
    screen: getNotificationText(data.screen),
    target: getNotificationText(data.target),
    shipment_id: getNotificationText(data.shipment_id),
    tracking_id: getNotificationText(data.tracking_id),
    package_id: getNotificationText(data.package_id),
    qbox_id: getNotificationText(data.qbox_id),
    qr_code_id: getNotificationText(data.qr_code_id),
    click_action: getNotificationText(data.click_action),
  };
};

const getStoredDeviceToken = async (homeOwnerId: string) => {
  const [storedToken, storedOwnerId] = await Promise.all([
    SecureStore.getItemAsync(PUSH_TOKEN_STORE_KEY),
    SecureStore.getItemAsync(PUSH_TOKEN_OWNER_KEY),
  ]);

  return storedToken && storedOwnerId === homeOwnerId ? storedToken : null;
};

const persistDeviceToken = async (homeOwnerId: string, token: string) => {
  await Promise.all([
    SecureStore.setItemAsync(PUSH_TOKEN_STORE_KEY, token),
    SecureStore.setItemAsync(PUSH_TOKEN_OWNER_KEY, homeOwnerId),
  ]);
};

const registerDeviceToken = async (
  homeOwnerId: string,
  Notifications: {
    getPermissionsAsync?: () => Promise<{ status: string }>;
    requestPermissionsAsync?: () => Promise<{ status: string }>;
    getDevicePushTokenAsync?: () => Promise<{ data: string }>;
  } | null
) => {
  if (!Notifications?.getDevicePushTokenAsync || !Notifications.getPermissionsAsync) {
    return null;
  }

  const existingToken = await getStoredDeviceToken(homeOwnerId);
  if (existingToken) {
    return existingToken;
  }

  const permissions = await Notifications.getPermissionsAsync();
  let status = permissions.status;

  if (status !== "granted") {
    if (!Notifications.requestPermissionsAsync) {
      return null;
    }

    const requested = await Notifications.requestPermissionsAsync();
    status = requested.status;
  }

  if (status !== "granted") {
    return null;
  }

  let token: string | null = null;

  try {
    const tokenResponse = await Notifications.getDevicePushTokenAsync();
    token = tokenResponse.data;
  } catch (error) {
    console.warn("[notifications] Device push token unavailable", error);
    return null;
  }

  if (!token) {
    return null;
  }

  try {
    await persistDeviceToken(homeOwnerId, token);
  } catch (error) {
    console.warn("[notifications] Failed to persist device token", error);
  }

  try {
    await NotificationService.registerDeviceToken({
      home_owner_id: homeOwnerId,
      token,
      platform: Platform.OS === "ios" ? "ios" : "android",
      device_name: null,
    });
  } catch (error) {
    console.warn("[notifications] Device token registration failed", error);
  }

  return token;
};

export const NotificationBootstrap = () => {
  const { user } = useAuth();
  const homeOwnerId = user?.id;

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      if (!homeOwnerId) {
        return;
      }

      const Notifications = await loadNotificationsModule();
      if (!Notifications || cancelled) {
        return;
      }

      if (cancelled) {
        return;
      }

      try {
        if (typeof Notifications.setNotificationHandler === "function") {
          Notifications.setNotificationHandler({
            handleNotification: async () => ({
              shouldShowAlert: true,
              shouldPlaySound: true,
              shouldSetBadge: false,
            }),
          });
        }
      } catch (error) {
        console.warn("[notifications] setNotificationHandler failed", error);
      }

      void registerDeviceToken(homeOwnerId, Notifications);
    })();

    return () => {
      cancelled = true;
    };
  }, [homeOwnerId]);

  useEffect(() => {
    let cancelled = false;
    let receiveSubscription: { remove: () => void } | null = null;
    let responseSubscription: { remove: () => void } | null = null;

    void (async () => {
      if (!homeOwnerId) {
        return;
      }

      const Notifications = await loadNotificationsModule();
      if (!Notifications || cancelled) {
        return;
      }

      const handleNotificationResponse = (response: {
        notification: PushNotificationLike;
      }) => {
        const pushNotification = response.notification;
        const notification = buildNotificationFromPush(pushNotification);
        const route = NotificationService.resolveNotificationRoute(notification);

        if (route) {
          router.push(route);
        } else {
          router.push("/notification");
        }

        void Notifications.clearLastNotificationResponseAsync?.().catch(() => undefined);
      };

      if (typeof Notifications.addNotificationReceivedListener === "function") {
        receiveSubscription = Notifications.addNotificationReceivedListener(
          (notification: PushNotificationLike) => {
            const normalized = buildNotificationFromPush(notification);
            prependNotificationToCache(queryClient, homeOwnerId, normalized);
          }
        );
      }

      if (typeof Notifications.addNotificationResponseReceivedListener === "function") {
        responseSubscription = Notifications.addNotificationResponseReceivedListener(
          handleNotificationResponse
        );
      }

      if (typeof Notifications.clearLastNotificationResponseAsync === "function") {
        await Notifications.clearLastNotificationResponseAsync().catch(() => undefined);
      }
    })();

    return () => {
      cancelled = true;
      receiveSubscription?.remove();
      responseSubscription?.remove();
    };
  }, [homeOwnerId]);

  return null;
};

export default NotificationBootstrap;
