import { Card, Text } from "@/components";
import { Colors, Spacing } from "@/constants";
import { useBleProvisioning } from "@/context";
import { mvs } from "@/utils/metrices";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WifiNetwork {
  ssid: string;
  rssi: number;
  security: string;
  secured: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getWifiSignalIcon = (rssi: number) => {
  if (rssi > -60) return "wifi";
  if (rssi > -70) return "wifi-outline";
  return "wifi-outline";
};

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function BleWifiProvisioning() {
  const router = useRouter();
  const { connectedDevice, sendBleCommand, disconnect } = useBleProvisioning();

  const [isLoading, setIsLoading] = useState(true);
  const [networks, setNetworks] = useState<WifiNetwork[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<WifiNetwork | null>(null);
  const [password, setPassword] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleWifiResponse = useCallback((data: any) => {
    if (data.status === "success" && data.networks) {
      const uniqueNetworks = data.networks.reduce((acc: WifiNetwork[], curr: WifiNetwork) => {
        if (!acc.find((n) => n.ssid === curr.ssid)) {
          acc.push(curr);
        }
        return acc;
      }, []);

      uniqueNetworks.sort((a: WifiNetwork, b: WifiNetwork) => b.rssi - a.rssi);
      setNetworks(uniqueNetworks);
      setIsLoading(false);
    } else if (data.status === "failed") {
      setError(data.error || "Operation failed");
      setIsLoading(false);
    }
  }, []);

  const fetchNetworks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await sendBleCommand({ action: "scan_wifi" });
      handleWifiResponse(response);
    } catch (e: any) {
      setError(e.message || "Failed to scan WiFi networks.");
      setIsLoading(false);
    }
  }, [sendBleCommand, handleWifiResponse]);

  const handleConnect = async () => {
    if (!selectedNetwork) return;
    setIsConnecting(true);
    setError(null);
    try {
      const response = await sendBleCommand({
        action: "connect_wifi",
        ssid: selectedNetwork.ssid,
        password: password,
      });

      if (response.status === "success" && response.connection) {
        setIsConnecting(false);
        setSelectedNetwork(null);
        setPassword("");
        alert("WiFi Provisioned Successfully!");
        // We disconnect as requested by the original plan after success
        await disconnect();
        router.push("/(app)/(profile)");
      } else {
        throw new Error(response.error || "WiFi connection failed");
      }
    } catch (e: any) {
      setError(e.message || "Failed to connect to WiFi.");
      setIsConnecting(false);
    }
  };

  // ── Initial setup ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (!connectedDevice) {
      router.back();
      return;
    }
    fetchNetworks();
  }, [connectedDevice, fetchNetworks, router]);

  // ── Render device row ────────────────────────────────────────────────────

  const renderItem = ({ item }: { item: WifiNetwork }) => (
    <Card
      variant="outlined"
      style={styles.card}
      backgroundColor={Colors.white}
      contentStyle={styles.cardContent}
      onPress={() => setSelectedNetwork(item)}
    >
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          <Ionicons name={getWifiSignalIcon(item.rssi)} size={22} color={Colors.text} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.ssidText} numberOfLines={1}>
            {item.ssid}
          </Text>
          <Text variant="secondary" size="sm">
            {item.security || (item.secured ? "Secured" : "Open")}
          </Text>
        </View>
      </View>
      <View style={styles.rightSection}>
        {item.secured && (
          <Ionicons name="lock-closed" size={16} color={Colors.warning} style={{ marginRight: 8 }} />
        )}
        <Ionicons name="chevron-forward" size={20} color={(Colors as any).secondaryText ?? "#9CA3AF"} />
      </View>
    </Card>
  );

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Available Networks</Text>
        <TouchableOpacity style={styles.rescanBtn} onPress={fetchNetworks} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color={Colors.primary ?? "#2563EB"} />
          ) : (
            <>
              <Ionicons name="refresh" size={16} color={Colors.primary ?? "#2563EB"} />
              <Text style={styles.rescanText}>Rescan</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={20} color="#fff" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={networks}
        keyExtractor={(item) => item.ssid}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="wifi-outline" size={56} color={(Colors as any).secondaryText ?? "#9CA3AF"} />
              <Text variant="secondary" style={{ marginTop: mvs(12), textAlign: "center" }}>
                No WiFi networks found.{"\n"}Try moving the SmartLocker or router closer.
              </Text>
            </View>
          ) : null
        }
      />

      {/* Password Modal */}
      <Modal visible={!!selectedNetwork} transparent animationType="slide">
        <View style={modalStyles.backdrop}>
          <View style={modalStyles.sheet}>
            <View style={modalStyles.header}>
              <Text style={modalStyles.title}>Connect to WiFi</Text>
              <Text variant="secondary" size="sm">{selectedNetwork?.ssid}</Text>
            </View>

            {selectedNetwork?.secured && (
              <View style={modalStyles.inputContainer}>
                <Text style={modalStyles.label}>Password</Text>
                <TextInput
                  style={modalStyles.input}
                  placeholder="Enter WiFi password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  autoFocus
                />
              </View>
            )}

            <View style={modalStyles.actions}>
              <TouchableOpacity
                style={[modalStyles.btn, modalStyles.cancelBtn]}
                onPress={() => {
                  setSelectedNetwork(null);
                  setPassword("");
                }}
                disabled={isConnecting}
              >
                <Text style={modalStyles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[modalStyles.btn, modalStyles.connectBtn]}
                onPress={handleConnect}
                disabled={isConnecting || (selectedNetwork?.secured && !password)}
              >
                {isConnecting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={modalStyles.connectBtnText}>Connect</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {isLoading && networks.length === 0 && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primary ?? "#2563EB"} />
          <Text style={{ marginTop: 16 }}>Scanning for WiFi...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: mvs(20),
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: Colors.text },
  rescanBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#EFF6FF", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  rescanText: { color: Colors.primary ?? "#2563EB", fontWeight: "600" },
  listContainer: { padding: mvs(20), paddingBottom: mvs(40) },
  card: { marginBottom: mvs(12), borderRadius: 16 },
  cardContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: mvs(16) },
  leftSection: { flexDirection: "row", alignItems: "center", flex: 1 },
  iconContainer: { width: 44, height: 44, borderRadius: 12, backgroundColor: "#F3F4F6", justifyContent: "center", alignItems: "center", marginRight: 12 },
  textContainer: { flex: 1 },
  ssidText: { fontSize: 16, fontWeight: "600", color: Colors.text },
  rightSection: { flexDirection: "row", alignItems: "center" },
  errorBanner: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.danger, padding: 12, gap: 10 },
  errorText: { color: "#fff", flex: 1, fontSize: 14 },
  loaderContainer: { ...StyleSheet.absoluteFillObject, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(255,255,255,0.7)" },
  emptyContainer: { alignItems: "center", marginTop: mvs(100) },
});

const modalStyles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  sheet: { backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: mvs(24), paddingBottom: mvs(40) },
  header: { marginBottom: 24 },
  title: { fontSize: 20, fontWeight: "700", color: Colors.text, marginBottom: 4 },
  inputContainer: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: "600", color: Colors.text, marginBottom: 8 },
  input: { backgroundColor: "#F9FAFB", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, padding: 14, fontSize: 16 },
  actions: { flexDirection: "row", gap: 12 },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  cancelBtn: { backgroundColor: "#F3F4F6" },
  cancelBtnText: { color: "#4B5563", fontWeight: "600" },
  connectBtn: { backgroundColor: Colors.primary ?? "#2563EB" },
  connectBtnText: { color: "#fff", fontWeight: "600" },
});
