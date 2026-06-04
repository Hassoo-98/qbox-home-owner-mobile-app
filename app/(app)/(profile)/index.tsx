import { MenuList, ProfileCard, ProfileSkeleton, SubscriptionCard, Text } from "@/components";
import { MENU_ITEM } from "@/constants";
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
  const { profile, isLoading } = useProfileLogic();
  const qboxId = profile?.qboxes?.[0]?.qbox_id;
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
        if (item.title === "Wifi") {
          const isChecking = item.title === checkingMenu || wifiStatus === "checking";
          return {
            ...item,
            rightText: isChecking
              ? undefined
              : wifiStatus === "connected"
                ? "Connected"
                : "Disconnected",
            isBadge: !isChecking,
            rightElement: isChecking ? <ActivityIndicator size="small" /> : undefined,
          };
        }

        if (item.title !== checkingMenu) return item;

        return {
          ...item,
          rightText: undefined,
          isBadge: false,
          rightElement: <ActivityIndicator size="small" />,
        };
      }),
    [checkingMenu, wifiStatus]
  );

  const handleMenuItemPress = useCallback(async (item: ProfileItem) => {
    if (item.title !== "Bluetooth" && item.title !== "Wifi") return false;

    if (!qboxId) {
      Alert.alert("QBox not found", "No QBox is linked with this account.");
      return true;
    }

    if (checkingMenu) return true;

    setCheckingMenu(item.title);
    const isOnline = await checkQBoxOnline();
    setWifiStatus(isOnline ? "connected" : "disconnected");
    setCheckingMenu(null);

    if (item.title === "Bluetooth") {
      if (!isOnline) {
        router.navigate("/(app)/(profile)/bluetoothList");
        return true;
      }

      Alert.alert(
        "Device already connected",
        "Your device is already connected with Wi-Fi. You are not able to use Bluetooth."
      );
      return true;
    }

    if (!isOnline) {
      Alert.alert(
        "Device offline",
        "Your QBox is offline. Wi-Fi settings are locked until the device is online."
      );
      return true;
    }

    router.navigate("/(app)/(profile)/wifiList");
    return true;
  }, [checkQBoxOnline, checkingMenu, qboxId]);

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
        Developed and Maintained by REPLA Technologies PVT Ltd
      </Text>
    </ScrollView>
  );
};

export default Profile;
