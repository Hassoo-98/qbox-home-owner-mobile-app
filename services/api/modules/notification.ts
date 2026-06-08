import api from "../config";
import {
  Notification,
  NotificationPageResponse,
  NotificationCategory,
  RegisterDeviceTokenPayload,
  RegisterDeviceTokenResponse,
} from "../types";

export interface NotificationFeedPage {
  items: Notification[];
  count: number;
  next: string | null;
  previous: string | null;
  hasMore: boolean;
  raw: unknown;
}

export interface ResolvedNotificationRoute {
  pathname: string;
  params?: Record<string, string>;
}

const SHIPMENT_KEYWORDS = [
  "shipment",
  "shipments",
  "package",
  "parcel",
  "delivery",
  "deliver",
  "tracking",
  "courier",
];

const QBOX_KEYWORDS = ["qbox", "locker", "device", "camera", "access", "qr", "pin"];
const BILLING_KEYWORDS = [
  "bill",
  "billing",
  "payment",
  "invoice",
  "subscription",
  "charge",
  "refund",
  "renew",
];
const ACCOUNT_KEYWORDS = [
  "account",
  "profile",
  "password",
  "security",
  "login",
  "email",
  "phone",
  "verification",
  "settings",
];

const ensureString = (value: unknown) => {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number") {
    return `${value}`;
  }

  return "";
};

const getDataRecord = (notification: Notification) => {
  if (notification.data && typeof notification.data === "object") {
    return notification.data;
  }

  if (notification.payload && typeof notification.payload === "object") {
    return notification.payload;
  }

  return {};
};

const getField = (notification: Notification, keys: string[]) => {
  const data = getDataRecord(notification);

  for (const key of keys) {
    const value =
      notification[key as keyof Notification] ??
      data[key as keyof typeof data] ??
      data[key.toLowerCase() as keyof typeof data];

    const normalized = ensureString(value);
    if (normalized) {
      return normalized;
    }
  }

  return "";
};

export const getNotificationTitle = (notification: Notification) =>
  getField(notification, ["title", "heading", "subject"]) ||
  "Notification";

export const getNotificationBody = (notification: Notification) =>
  getField(notification, ["body", "message", "description"]);

export const getNotificationCreatedAt = (notification: Notification) =>
  getField(notification, ["createdAt", "created_at", "created"]);

export const isNotificationRead = (notification: Notification) => {
  if (typeof notification.read === "boolean") return notification.read;
  if (typeof notification.is_read === "boolean") return notification.is_read;
  if (typeof notification.unread === "boolean") return !notification.unread;
  return false;
};

export const deriveNotificationCategory = (
  notification: Notification
): NotificationCategory => {
  const explicitCategory = ensureString(notification.category).toLowerCase();
  if (explicitCategory === "shipments" || explicitCategory === "shipment") {
    return "shipments";
  }
  if (explicitCategory === "qbox") {
    return "qbox";
  }
  if (explicitCategory === "billing" || explicitCategory === "payments") {
    return "billing";
  }
  if (explicitCategory === "accounts" || explicitCategory === "account") {
    return "accounts";
  }

  const haystack = `${getNotificationTitle(notification)} ${getNotificationBody(notification)}`
    .toLowerCase();

  if (SHIPMENT_KEYWORDS.some((keyword) => haystack.includes(keyword))) {
    return "shipments";
  }
  if (QBOX_KEYWORDS.some((keyword) => haystack.includes(keyword))) {
    return "qbox";
  }
  if (BILLING_KEYWORDS.some((keyword) => haystack.includes(keyword))) {
    return "billing";
  }
  if (ACCOUNT_KEYWORDS.some((keyword) => haystack.includes(keyword))) {
    return "accounts";
  }

  return "accounts";
};

const extractItems = (raw: NotificationPageResponse | Notification[] | unknown) => {
  if (Array.isArray(raw)) {
    return {
      items: raw,
      count: raw.length,
      next: null,
      previous: null,
    };
  }

  const response = (raw || {}) as NotificationPageResponse;
  const data = response.data;

  if (Array.isArray(data)) {
    return {
      items: data,
      count: response.count ?? data.length,
      next: response.next ?? null,
      previous: response.previous ?? null,
    };
  }

  if (data && typeof data === "object") {
    const nested = data as {
      count?: number;
      next?: string | null;
      previous?: string | null;
      results?: Notification[];
      items?: Notification[];
    };

    const items = nested.items ?? nested.results ?? [];
    return {
      items,
      count: nested.count ?? response.count ?? items.length,
      next: nested.next ?? response.next ?? null,
      previous: nested.previous ?? response.previous ?? null,
    };
  }

  const items = response.results ?? response.items ?? [];
  return {
    items,
    count: response.count ?? items.length,
    next: response.next ?? null,
    previous: response.previous ?? null,
  };
};

export const normalizeNotificationPage = (
  raw: NotificationPageResponse | Notification[] | unknown
): NotificationFeedPage => {
  const { items, count, next, previous } = extractItems(raw as NotificationPageResponse);

  return {
    items,
    count,
    next,
    previous,
    hasMore: Boolean(next),
    raw,
  };
};

export const notificationQueryKeys = {
  all: ["notifications"] as const,
  homeOwner: (homeOwnerId: string) =>
    ["notifications", "home-owner", homeOwnerId] as const,
};

const getNotificationListUrl = (homeOwnerId: string) =>
  `/notifications/home-owner/${homeOwnerId}/`;

export const getHomeOwnerNotifications = async (
  homeOwnerId: string,
  pageParam?: string | number | null
): Promise<NotificationFeedPage> => {
  const useAbsoluteUrl =
    typeof pageParam === "string" &&
    /^https?:\/\//i.test(pageParam.trim());

  const response = useAbsoluteUrl
    ? await api.get<NotificationPageResponse | Notification[]>(pageParam)
    : await api.get<NotificationPageResponse | Notification[]>(
        getNotificationListUrl(homeOwnerId),
        {
          params:
            pageParam === undefined || pageParam === null
              ? undefined
              : typeof pageParam === "number"
                ? { page: pageParam }
                : { page: pageParam },
        }
      );

  return normalizeNotificationPage(response.data);
};

export const registerDeviceToken = async (
  payload: RegisterDeviceTokenPayload
): Promise<RegisterDeviceTokenResponse> => {
  const endpoint =
    process.env.EXPO_PUBLIC_NOTIFICATION_DEVICE_TOKEN_ENDPOINT?.trim() ||
    "/notifications/device-tokens/";

  const response = await api.post<RegisterDeviceTokenResponse>(endpoint, payload);
  return response.data;
};

export const markAllNotificationsAsRead = async (homeOwnerId: string) => {
  const response = await api.post(
    `/notifications/home-owner/${homeOwnerId}/read-all/`
  );
  return response.data;
};

export const sendAlert = async (data: {
  title: string;
  body: string;
  user_id: string;
}) => {
  const response = await api.post("/home_owner/notify/send", data);
  return response.data;
};

export const normalizeNotificationForUI = (notification: Notification) => ({
  ...notification,
  title: getNotificationTitle(notification),
  body: getNotificationBody(notification),
  createdAt: getNotificationCreatedAt(notification),
  category: deriveNotificationCategory(notification),
  read: isNotificationRead(notification),
});

export const resolveNotificationRoute = (
  notification: Notification
): ResolvedNotificationRoute | null => {
  const data = getDataRecord(notification);
  const directRoute =
    getField(notification, ["route", "screen", "target", "click_action"]) ||
    ensureString(data.route) ||
    ensureString(data.screen) ||
    ensureString(data.target);

  if (directRoute.startsWith("/")) {
    return { pathname: directRoute };
  }

  const category = deriveNotificationCategory(notification);

  if (category === "shipments") {
    const trackingId =
      getField(notification, ["tracking_id", "trackingId", "package_id", "packageId"]) ||
      ensureString(data.tracking_id) ||
      ensureString(data.trackingId) ||
      ensureString(data.package_id) ||
      ensureString(data.packageId);

    const shipmentType =
      getField(notification, ["shipment_type", "shipmentType", "type"]) ||
      ensureString(data.shipment_type) ||
      ensureString(data.shipmentType) ||
      ensureString(data.type);

    if (trackingId && shipmentType) {
      return {
        pathname: "/packageDetails/[id]",
        params: {
          id: trackingId,
          type: shipmentType.toLowerCase(),
        },
      };
    }

    if (trackingId) {
      return {
        pathname: "/packageDetails/[id]",
        params: {
          id: trackingId,
          type: "outgoing",
        },
      };
    }
  }

  if (category === "qbox") {
    const qrId =
      getField(notification, ["qr_code_id", "qrCodeId", "qbox_id", "qboxId", "id"]) ||
      ensureString(data.qr_code_id) ||
      ensureString(data.qrCodeId) ||
      ensureString(data.qbox_id) ||
      ensureString(data.qboxId) ||
      ensureString(data.id);

    if (qrId) {
      return {
        pathname: "/qrCodeDetails/[id]",
        params: { id: qrId },
      };
    }

    return { pathname: "/myQbox" };
  }

  if (category === "billing") {
    return { pathname: "/(app)/(profile)/subscriptionHistory" };
  }

  if (category === "accounts") {
    return { pathname: "/(app)/(profile)/basicInformation" };
  }

  return { pathname: "/notification" };
};
