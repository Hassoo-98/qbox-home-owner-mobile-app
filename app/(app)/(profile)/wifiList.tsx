import { OnlineStatusIcon } from "@/assets/icons";
import { Button, Card, PasswordInput, Text } from "@/components";
import { Colors, Spacing } from "@/constants";
import { useHomeOwner } from "@/hooks/useHomeOwner";
import api from "@/services/api/config";
import { mvs } from "@/utils/metrices";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Alert, Animated, Easing, FlatList, Modal, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";

interface WifiNetwork {
  ssid: string;
  rssi: number;
  is_secured: boolean;
}

interface WifiStateResponse {
  device_id: string;
  is_online: boolean;
  last_seen: string;
  connected_ssid: string;
  signal_strength: number | null;
  rssi: number | null;
  wifi_status: string;
}

export const WifiList = () => {
  const { data: homeOwnerResponse } = useHomeOwner();
  const homeOwner = homeOwnerResponse?.data;
  const qboxId = homeOwner?.qboxes?.[0]?.qbox_id;

  const navigation = useNavigation();
  const [networks, setNetworks] = useState<WifiNetwork[]>([]);
  const [connectedSsid, setConnectedSsid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRescanning, setIsRescanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Spin animation for rescan icon
  const spinValue = useRef(new Animated.Value(0)).current;
  const spinAnimation = useRef<Animated.CompositeAnimation | null>(null);

  const startSpin = () => {
    spinValue.setValue(0);
    spinAnimation.current = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spinAnimation.current.start();
  };

  const stopSpin = () => {
    spinAnimation.current?.stop();
    spinValue.setValue(0);
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  // Connection Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<WifiNetwork | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      password: "",
    }
  });

  const fetchWifiNetworks = useCallback(async (isManualRescan = false) => {
    if (!qboxId) {
      if (homeOwnerResponse) {
        setError("No QBox found for this user");
        setLoading(false);
      }
      return;
    }

    if (isManualRescan) {
      setIsRescanning(true);
      startSpin();
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const [networksResponse, stateResponse] = await Promise.all([
        api.get(`/devices/${qboxId}/wifi/networks/`),
        api.get(`/devices/${qboxId}/state/`)
      ]);

      const networksData = networksResponse.data;
      let fetchedNetworks: WifiNetwork[] = networksData.networks || [];
      let currentConnectedSsid = networksData.connected_ssid || null;

      if (stateResponse.status === 200) {
        const stateData: WifiStateResponse = stateResponse.data;
        if (!currentConnectedSsid) {
          currentConnectedSsid = stateData.connected_ssid || null;
        }
      }

      setConnectedSsid(currentConnectedSsid);

      if (currentConnectedSsid && !fetchedNetworks.some(n => n.ssid === currentConnectedSsid)) {
        fetchedNetworks.push({
          ssid: currentConnectedSsid,
          rssi: -50,
          is_secured: true,
        });
      }

      fetchedNetworks.sort((a, b) => {
        if (a.ssid === currentConnectedSsid) return -1;
        if (b.ssid === currentConnectedSsid) return 1;
        return b.rssi - a.rssi;
      });

      setNetworks(fetchedNetworks);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
      setIsRescanning(false);
      stopSpin();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qboxId, homeOwnerResponse]);

  useEffect(() => {
    fetchWifiNetworks();
  }, [fetchWifiNetworks]);

  // Inject Rescan button into native header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => fetchWifiNetworks(true)}
          disabled={isRescanning}
          style={{ marginRight: 16, padding: 4 }}
          activeOpacity={0.7}
        >
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Ionicons
              name="refresh"
              size={22}
              color={isRescanning ? Colors.secondaryText : Colors.primary}
            />
          </Animated.View>
        </TouchableOpacity>
      ),
    });
  }, [navigation, fetchWifiNetworks, isRescanning, spin]);

  const handleConnect = handleSubmit(async (data) => {
    if (!selectedNetwork || !qboxId) return;

    setConnectionError(null);
    setIsConnecting(true);
    try {
      const payload: { ssid: string; password?: string } = {
        ssid: selectedNetwork.ssid,
      };
      if (data.password && data.password.trim().length > 0) {
        payload.password = data.password.trim();
      }

      const response = await api.post(`/devices/${qboxId}/wifi/connect/`, payload);
      const result = response.data?.result;

      // API returns HTTP 200 even on failure — check result.status explicitly
      if (result?.status === "FAILED") {
        const reason = result?.details?.reason;
        if (reason === "auth_failed") {
          setConnectionError("Incorrect password. Please check and try again.");
        } else {
          setConnectionError(result?.message || "Connection failed. Network may be unavailable.");
        }
        return;
      }

      // Success
      Alert.alert("Success", `Connecting to ${selectedNetwork.ssid}...`);
      setIsModalVisible(false);
      reset();
      setConnectionError(null);
    } catch (err: any) {
      const apiMessage = err.response?.data?.result?.message
        || err.response?.data?.detail
        || err.response?.data?.message
        || err.message
        || "An unexpected error occurred.";
      setConnectionError(apiMessage);
    } finally {
      setIsConnecting(false);
    }
  });

  const openConnectModal = (network: WifiNetwork) => {
    setSelectedNetwork(network);
    reset();
    setConnectionError(null);
    setIsModalVisible(true);
  };



  const renderItem = ({ item }: { item: WifiNetwork }) => {
    const isConnected = item.ssid === connectedSsid;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => openConnectModal(item)}
      >
        <Card
          variant="outlined"
          style={[styles.card, isConnected && { borderColor: Colors.primary, borderWidth: 2 }]}
          backgroundColor={Colors.white}
          contentStyle={styles.cardContent}
        >
          <View style={styles.leftSection}>
            <View style={[styles.iconContainer, isConnected && { backgroundColor: Colors.primary }]}>
              <OnlineStatusIcon size={24} color={isConnected ? Colors.white : Colors.text} />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.ssidText, isConnected && { color: Colors.primary }]} numberOfLines={1}>
                {item.ssid}
              </Text>
              <Text variant="secondary" size="sm" style={isConnected && { color: Colors.primary, fontWeight: "500" }}>
                {isConnected ? "Connected" : `Signal: ${item.rssi} dBm`}
              </Text>
            </View>
          </View>

          <View style={styles.rightSection}>
            {item.is_secured && (
              <Ionicons name="lock-closed" size={16} color={Colors.secondaryText} />
            )}
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Scanning for networks...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="warning-outline" size={48} color={Colors.danger} />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={networks}
        keyExtractor={(item, index) => `${item.ssid}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text variant="secondary">No Wi-Fi networks found.</Text>
          </View>
        }
      />

      {/* Connection Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsModalVisible(false)}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <View style={styles.modalIconContainer}>
                <Ionicons name="wifi" size={32} color={Colors.primary} />
              </View>
              <Text style={styles.modalTitle}>Connect to Network</Text>
              <Text style={styles.modalSubtitle}>{selectedNetwork?.ssid}</Text>
            </View>

            <View style={styles.modalBody}>
              <PasswordInput
                name="password"
                control={control}
                label={selectedNetwork?.is_secured ? "Password" : "Password (Optional)"}
                placeholder={selectedNetwork?.is_secured ? "Enter Wi-Fi password" : "Leave empty for open network"}
                containerStyle={styles.inputContainer}
              />
              {!selectedNetwork?.is_secured && !connectionError && (
                <Text style={styles.unsecuredText}>
                  This is an open network. You can connect without a password.
                </Text>
              )}
              {connectionError && (
                <View style={styles.errorBanner}>
                  <Ionicons name="alert-circle" size={16} color={Colors.danger} style={{ marginRight: 6 }} />
                  <Text style={styles.errorBannerText}>{connectionError}</Text>
                </View>
              )}
            </View>

            <View style={styles.modalFooter}>
              <Button
                title="Connect"
                onPress={handleConnect}
                loading={isConnecting}
                variant="primary"
                style={styles.connectButton}
              />
              <Button
                title="Cancel"
                onPress={() => setIsModalVisible(false)}
                variant="outline"
                style={styles.cancelButton}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContainer: {
    padding: mvs(20),
    paddingBottom: mvs(40),
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    padding: Spacing.xl,
  },
  card: {
    marginBottom: mvs(12),
    width: "100%",
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: mvs(12),
    paddingHorizontal: mvs(16),
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray,
    justifyContent: "center",
    alignItems: "center",
    marginRight: mvs(12),
  },
  textContainer: {
    flex: 1,
    paddingRight: mvs(10),
  },
  ssidText: {
    fontWeight: "600",
    color: Colors.text,
    marginBottom: mvs(2),
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingText: {
    marginTop: mvs(12),
    color: Colors.primary,
  },
  errorText: {
    marginTop: mvs(12),
    color: Colors.danger,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: mvs(24),
    paddingBottom: mvs(40),
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: mvs(24),
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: mvs(16),
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: mvs(4),
  },
  modalSubtitle: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "600",
  },
  modalBody: {
    marginBottom: mvs(24),
  },
  inputContainer: {
    marginBottom: mvs(16),
  },
  unsecuredText: {
    textAlign: "center",
    color: Colors.secondaryText,
    fontSize: 14,
    fontStyle: "italic",
  },
  modalFooter: {
    gap: mvs(12),
  },
  connectButton: {
    width: "100%",
  },
  cancelButton: {
    width: "100%",
    borderWidth: 0,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${Colors.danger}15`,
    borderRadius: 10,
    padding: mvs(10),
    marginTop: mvs(4),
  },
  errorBannerText: {
    color: Colors.danger,
    fontSize: 13,
    flex: 1,
    flexWrap: "wrap",
  },
});

export default WifiList;
