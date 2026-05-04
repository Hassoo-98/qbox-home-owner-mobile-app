import { OnlineStatusIcon } from "@/assets/icons";
import { Card, Text } from "@/components";
import { Colors, Spacing } from "@/constants";
import { useHomeOwner } from "@/hooks/useHomeOwner";
import { mvs } from "@/utils/metrices";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Modal, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, PasswordInput } from "@/components";
import api from "@/services/api/config";
import { useForm } from "react-hook-form";

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

  const [networks, setNetworks] = useState<WifiNetwork[]>([]);
  const [connectedSsid, setConnectedSsid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Connection Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<WifiNetwork | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      password: "",
    }
  });

  useEffect(() => {
    const fetchWifiNetworks = async () => {
      if (!qboxId) {
        if (homeOwnerResponse) {
          setError("No QBox found for this user");
          setLoading(false);
        }
        return;
      }

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

        // If connected SSID is not in the list, add it
        if (currentConnectedSsid && !fetchedNetworks.some(n => n.ssid === currentConnectedSsid)) {
          fetchedNetworks.push({
            ssid: currentConnectedSsid,
            rssi: -50, // Default signal for connected
            is_secured: true,
          });
        }

        // Sort so connected is at the top
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
      }
    };

    fetchWifiNetworks();
  }, [qboxId, homeOwnerResponse]);

  const handleConnect = handleSubmit(async (data) => {
    if (!selectedNetwork || !qboxId) return;

    setIsConnecting(true);
    try {
      const response = await api.post(`/devices/${qboxId}/wifi/connect/`, {
        ssid: selectedNetwork.ssid,
        password: data.password,
      });

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Success", `Attempting to connect to ${selectedNetwork.ssid}`);
        setIsModalVisible(false);
        reset();
      } else {
        throw new Error("Failed to connect");
      }
    } catch (err: any) {
      Alert.alert("Connection Failed", err.response?.data?.message || err.message || "An unexpected error occurred");
    } finally {
      setIsConnecting(false);
    }
  });

  const openConnectModal = (network: WifiNetwork) => {
    setSelectedNetwork(network);
    reset();
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
              {selectedNetwork?.is_secured ? (
                <PasswordInput
                  name="password"
                  control={control}
                  label="Password"
                  placeholder="Enter Wi-Fi password"
                  containerStyle={styles.inputContainer}
                />
              ) : (
                <Text style={styles.unsecuredText}>
                  This network is not secured.
                </Text>
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
});

export default WifiList;
