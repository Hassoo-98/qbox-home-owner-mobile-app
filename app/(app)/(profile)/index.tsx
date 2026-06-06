import { MenuList, ProfileCard, ProfileSkeleton, SubscriptionCard, Text } from "@/components";
import { MENU_ITEM } from "@/constants";
import { useLocale, useModal } from "@/hooks";
import { useRelocationStatus } from "@/hooks/api/useRelocationQueries";
import api from "@/services/api/config";
import { ProfileItem } from "@/types";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";
import { styles } from "./styles";
import { useProfileLogic } from "./useProfileLogic";

const QBOX_MENU_CHECK_TIMEOUT_MS = 4500;

const hasAvailableNetworks = (data: any) => {
  const networks = data?.networks;
  return Array.isArray(networks) && networks.length > 0;
};

export const Profile = () => {
  const { t, locale } = useLocale();
  const { onTriggerModal, onCloseModal } = useModal();
  const { profile, isLoading } = useProfileLogic();
  const qboxId = profile?.qboxes?.[0]?.qbox_id;
  const homeOwnerId = profile?.id || "";
  const relocationStatusQuery = useRelocationStatus(homeOwnerId);
  const [checkingMenu, setCheckingMenu] = useState<"Bluetooth" | "Wifi" | null>(null);
  const [wifiStatus, setWifiStatus] = useState<"checking" | "connected" | "disconnected">("checking");

  const checkQBoxOnline = useCallback(async () => {
    if (!qboxId) return false;

    try {
      const response = await api.get(`/devices/${qboxId}/wifi/networks/`, {
        timeout: QBOX_MENU_CHECK_TIMEOUT_MS,
      });
      return hasAvailableNetworks(response.data);
    } catch {
      return false;
    }
  }, [qboxId]);

  useEffect(() => {
    let isMounted = true;

    const refreshWifiStatus = async () => {
      if (!qboxId) {
        setWifiStatus("disconnected");
        return;
      }

      setWifiStatus("checking");
      const isOnline = await checkQBoxOnline();
      if (isMounted) {
        setWifiStatus(isOnline ? "connected" : "disconnected");
      }
    };

    refreshWifiStatus();
    return () => {
      isMounted = false;
    };
  }, [checkQBoxOnline, qboxId]);

  const menuData = useMemo(
    () =>
      MENU_ITEM.map((item) => {
        const translatedTitle =
          item.id === 1
            ? t("basicInformation")
            : item.id === 2
              ? t("language")
            : item.id === 3
                ? t("myQBoxLocation")
                : item.id === 4
                  ? t("subscriptionHistory")
                  : item.id === 5
                    ? t("promoCode")
                    : item.id === 6
                      ? t("contactUs")
                      : item.id === 7
                        ? t("logout")
                        : item.id === 8
                          ? t("wifi")
                          : item.id === 9
                            ? t("bluetooth")
                        : item.title;

        if (item.id === 8) {
          const isChecking = checkingMenu === "Wifi" || wifiStatus === "checking";
          return {
            ...item,
            title: translatedTitle,
            rightText: isChecking
              ? undefined
              : wifiStatus === "connected"
                ? t("connected")
                : t("disconnected"),
            isBadge: !isChecking,
            rightElement: isChecking ? <ActivityIndicator size="small" /> : undefined,
          };
        }

        if (item.id === 9) {
          return {
            ...item,
            title: translatedTitle,
            rightText: undefined,
            isBadge: false,
            rightElement: checkingMenu === "Bluetooth" ? <ActivityIndicator size="small" /> : undefined,
          };
        }

        return {
          ...item,
          title: translatedTitle,
          rightText: item.id === 2 ? (locale === "ar" ? t("arabic") : t("english")) : item.rightText,
        };
      }),
    [checkingMenu, locale, t, wifiStatus]
  );

  const handleMenuItemPress = useCallback(async (item: ProfileItem) => {
    if (item.id === 3) {
      const { data } = await relocationStatusQuery.refetch();
      const relocationStatus = data?.data;
      const hasPendingRelocationRequest =
        relocationStatus?.has_pending_request ||
        String(relocationStatus?.latest_status || "").toLowerCase() === "pending" ||
        String(relocationStatus?.pending_status || "").toLowerCase() === "pending";

      if (hasPendingRelocationRequest) {
        onTriggerModal({
          title:
            "You already have a pending relocation request. Please wait for approval before creating another one.",
          primaryButtonText: "Close",
          primaryButtonHandler: onCloseModal,
        });
        return true;
      }

      router.navigate("/(app)/(profile)/myQBoxLocation");
      return true;
    }

    if (item.id !== 8 && item.id !== 9) return false;

    if (!qboxId) {
      Alert.alert(t("notFound"), t("qboxNotFound"));
      return true;
    }

    if (checkingMenu) return true;

    setCheckingMenu(item.id === 9 ? "Bluetooth" : "Wifi");
    const isOnline = await checkQBoxOnline();
    setWifiStatus(isOnline ? "connected" : "disconnected");
    setCheckingMenu(null);

    if (item.id === 9) {
      if (!isOnline) {
        router.navigate("/(app)/(profile)/bluetoothList");
        return true;
      }

      Alert.alert(t("error"), t("deviceAlreadyConnected"));
      return true;
    }

    if (!isOnline) {
      Alert.alert(t("error"), t("deviceOffline"));
      return true;
    }

    router.navigate("/(app)/(profile)/wifiList");
    return true;
  }, [checkQBoxOnline, checkingMenu, onCloseModal, onTriggerModal, qboxId, relocationStatusQuery, t]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ProfileSkeleton />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <ProfileCard
        name={profile?.full_name}
        email={profile?.email}
        phone={profile?.phone}
      />

      <SubscriptionCard />

      <MenuList menuData={menuData} onItemPress={handleMenuItemPress} />

      <Text variant="secondary" size="xs" style={styles.maintenanceText}>
        Developed and maintained by REPLA Technologies PVT Ltd
      </Text>
    </ScrollView>
  );
};

export default Profile;
