import { Card, Text } from "@/components";
import { Colors, Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useBleProvisioning, DiscoveredBleDevice } from "@/context";
import { useRouter } from "expo-router";

// ─── Types ────────────────────────────────────────────────────────────────────

type ConnectionStatus = "idle" | "connecting" | "connected" | "failed";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getSignalBars = (rssi: number) => {
  if (rssi > -55) return 3;
  if (rssi > -70) return 2;
  return 1;
};

const getSignalColor = (rssi: number) => {
  if (rssi > -55) return Colors.success;
  if (rssi > -70) return Colors.warning;
  return Colors.danger;
};

// ─── Signal-bar indicator ─────────────────────────────────────────────────────

const SignalBars = ({ rssi }: { rssi: number }) => {
  const bars = getSignalBars(rssi);
  const color = getSignalColor(rssi);
  return (
    <View style={signalStyles.container}>
      {[1, 2, 3].map((b) => (
        <View
          key={b}
          style={[
            signalStyles.bar,
            { height: b * 5 + 4 },
            {
              backgroundColor:
                b <= bars ? color : (Colors as any).lightGray ?? "#E0E0E0",
            },
          ]}
        />
      ))}
    </View>
  );
};

const signalStyles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "flex-end", gap: 3 },
  bar: { width: 5, borderRadius: 2 },
});

// ─── Animated pulse ring shown while scanning ─────────────────────────────────

const PulseRing = () => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.6,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.6,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      style={{
        position: "absolute",
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.primary ?? "#2563EB",
        transform: [{ scale }],
        opacity,
      }}
    />
  );
};

// ─── Connect / status modal ───────────────────────────────────────────────────

interface ConnectModalProps {
  device: DiscoveredBleDevice | null;
  status: ConnectionStatus;
  onClose: () => void;
  onRetry: () => void;
}

const ConnectModal = ({
  device,
  status,
  onClose,
  onRetry,
}: ConnectModalProps) => {
  if (!device) return null;
  const isLoading = status === "connecting";

  return (
    <Modal transparent animationType="fade" visible={!!device}>
      <View style={modalStyles.backdrop}>
        <View style={modalStyles.sheet}>
          <View style={modalStyles.iconRing}>
            <Ionicons
              name="bluetooth"
              size={36}
              color={Colors.primary ?? "#2563EB"}
            />
          </View>

          <Text style={modalStyles.deviceName} numberOfLines={1}>
            {device.name}
          </Text>
          <Text
            variant="secondary"
            size="sm"
            style={{ textAlign: "center", marginBottom: mvs(20) }}
          >
            {device.id}
          </Text>

          {isLoading && (
            <View style={modalStyles.statusRow}>
              <ActivityIndicator color={Colors.primary ?? "#2563EB"} />
              <Text
                style={{ marginLeft: 10, color: Colors.primary ?? "#2563EB" }}
              >
                Connecting…
              </Text>
            </View>
          )}

          {status === "connected" && (
            <View style={modalStyles.statusRow}>
              <Ionicons
                name="checkmark-circle"
                size={22}
                color={Colors.success}
              />
              <Text style={{ marginLeft: 8, color: Colors.success }}>
                Connected!
              </Text>
            </View>
          )}

          {status === "failed" && (
            <View style={modalStyles.statusRow}>
              <Ionicons
                name="close-circle"
                size={22}
                color={Colors.danger}
              />
              <Text style={{ marginLeft: 8, color: Colors.danger }}>
                Connection failed
              </Text>
            </View>
          )}

          <View style={modalStyles.actions}>
            {status === "failed" && (
              <TouchableOpacity
                style={[modalStyles.btn, modalStyles.primaryBtn]}
                onPress={onRetry}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>Retry</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                modalStyles.btn,
                status === "failed"
                  ? modalStyles.ghostBtn
                  : modalStyles.primaryBtn,
              ]}
              onPress={onClose}
              disabled={isLoading}
            >
              <Text
                style={{
                  color:
                    status === "failed"
                      ? (Colors as any).secondaryText ?? "#888"
                      : "#fff",
                  fontWeight: "600",
                }}
              >
                {status === "connected" ? "Continue" : "Cancel"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  sheet: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: mvs(28),
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  iconRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: mvs(16),
  },
  deviceName: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
    marginBottom: mvs(4),
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: mvs(24),
  },
  actions: { flexDirection: "row", gap: 12, width: "100%" },
  btn: {
    flex: 1,
    paddingVertical: mvs(13),
    borderRadius: 12,
    alignItems: "center",
  },
  primaryBtn: { backgroundColor: Colors.primary ?? "#2563EB" },
  ghostBtn: {
    borderWidth: 1,
    borderColor: (Colors as any).border ?? "#E5E7EB",
  },
});

// ─── Main screen ──────────────────────────────────────────────────────────────

export const BluetoothList = () => {
  const router = useRouter();
  const {
    bleReady,
    isScanning,
    scanResults,
    startScan,
    connect,
    requestPermissions,
  } = useBleProvisioning();

  const [permissionDenied, setPermissionDenied] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<DiscoveredBleDevice | null>(null);
  const [connStatus, setConnStatus] = useState<ConnectionStatus>("idle");

  // ── Initial setup ─────────────────────────────────────────────────────────

  useEffect(() => {
    const init = async () => {
      const granted = await requestPermissions();
      if (!granted) {
        setPermissionDenied(true);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (bleReady && !permissionDenied) {
      startScan();
    }
  }, [bleReady, permissionDenied]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleConnect = useCallback(
    async (item: DiscoveredBleDevice) => {
      setSelectedDevice(item);
      setConnStatus("connecting");
      try {
        await connect(item.device);
        setConnStatus("connected");
      } catch (err) {
        setConnStatus("failed");
      }
    },
    [connect]
  );

  const handleModalClose = useCallback(() => {
    if (connStatus === "connected") {
      router.push("/(app)/(profile)/bleWifiProvisioning");
    }
    setSelectedDevice(null);
    setConnStatus("idle");
  }, [connStatus, router]);

  const handleRetry = useCallback(() => {
    if (selectedDevice) handleConnect(selectedDevice);
  }, [selectedDevice, handleConnect]);

  // ── Render device row ────────────────────────────────────────────────────

  const renderItem = ({ item }: { item: DiscoveredBleDevice }) => {
    return (
      <Card
        variant="outlined"
        style={styles.card}
        backgroundColor={Colors.white}
        contentStyle={styles.cardContent}
        onPress={() => handleConnect(item)}
      >
        <View style={styles.leftSection}>
          <View style={styles.iconContainer}>
            <Ionicons name="bluetooth" size={22} color={Colors.text} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.nameText} numberOfLines={1}>
              {item.name}
            </Text>
            <Text variant="secondary" size="sm">
              Signal: {item.rssi} dBm
            </Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <SignalBars rssi={item.rssi} />
          <Ionicons
            name="chevron-forward"
            size={20}
            color={(Colors as any).secondaryText ?? "#9CA3AF"}
            style={{ marginLeft: 6 }}
          />
        </View>
      </Card>
    );
  };

  // ── Permission denied ────────────────────────────────────────────────────

  if (permissionDenied) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="ban" size={52} color={Colors.danger} />
        <Text style={[styles.centeredTitle, { color: Colors.danger }]}>
          Permission Denied
        </Text>
        <Text
          variant="secondary"
          size="sm"
          style={{ textAlign: "center", marginTop: mvs(8) }}
        >
          Bluetooth and Location permissions are required to scan for SmartLocker
          devices. Please enable them in your device Settings.
        </Text>
      </View>
    );
  }

  // ── BLE not ready (off / unsupported) ────────────────────────────────────

  if (!bleReady && !isScanning) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons
          name="bluetooth-outline"
          size={52}
          color={(Colors as any).secondaryText ?? "#9CA3AF"}
        />
        <Text style={styles.centeredTitle}>Bluetooth is Off</Text>
        <Text
          variant="secondary"
          size="sm"
          style={{ textAlign: "center", marginTop: mvs(8) }}
        >
          Please turn on Bluetooth to discover your SmartLocker.
        </Text>
      </View>
    );
  }

  // ── Initial scanning splash ───────────────────────────────────────────────

  if (isScanning && scanResults.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <View style={{ width: 80, height: 80, justifyContent: "center", alignItems: "center" }}>
          <PulseRing />
          <Ionicons name="bluetooth" size={32} color={Colors.primary ?? "#2563EB"} />
        </View>
        <Text style={styles.centeredTitle}>Searching for SmartLocker…</Text>
        <Text variant="secondary" size="sm" style={{ textAlign: "center" }}>
          Make sure your SmartLocker is powered on and nearby.
        </Text>
      </View>
    );
  }

  // ── Device list ───────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.foundText}>
          {scanResults.length} SmartLocker{scanResults.length !== 1 ? "s" : ""} found
          {isScanning ? (
            <Text style={styles.scanningBadge}>  · scanning…</Text>
          ) : null}
        </Text>
        <TouchableOpacity
          style={styles.rescanBtn}
          onPress={startScan}
          disabled={isScanning || !bleReady}
        >
          {isScanning ? (
            <ActivityIndicator size="small" color={Colors.primary ?? "#2563EB"} />
          ) : (
            <>
              <Ionicons name="refresh" size={16} color={Colors.primary ?? "#2563EB"} />
              <Text style={styles.rescanText}>Rescan</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={scanResults}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="bluetooth-outline"
              size={56}
              color={(Colors as any).secondaryText ?? "#9CA3AF"}
            />
            <Text variant="secondary" style={{ marginTop: mvs(12), textAlign: "center" }}>
              No SmartLocker devices found.{"\n"}Try moving closer or restarting the device.
            </Text>
          </View>
        }
      />

      <ConnectModal
        device={selectedDevice}
        status={connStatus}
        onClose={handleModalClose}
        onRetry={handleRetry}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    padding: Spacing.xl,
    gap: mvs(16),
  },
  centeredTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: mvs(20),
    paddingVertical: mvs(12),
    borderBottomWidth: 1,
    borderBottomColor: (Colors as any).border ?? "#F0F0F0",
    backgroundColor: Colors.white,
  },
  foundText: { fontWeight: "600", color: Colors.text },
  rescanBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: mvs(14),
    paddingVertical: mvs(6),
    borderRadius: 20,
  },
  rescanText: { color: Colors.primary ?? "#2563EB", fontWeight: "600", fontSize: 13 },
  scanningBadge: { color: Colors.primary ?? "#2563EB", fontWeight: "400", fontSize: 13 },
  listContainer: { padding: mvs(20), paddingBottom: mvs(40) },
  card: { marginBottom: mvs(12), borderRadius: 16 },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: mvs(16),
  },
  leftSection: { flexDirection: "row", alignItems: "center", flex: 1 },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: mvs(12),
  },
  textContainer: { flex: 1 },
  nameText: { fontSize: 16, fontWeight: "600", color: Colors.text, marginBottom: 2 },
  rightSection: { flexDirection: "row", alignItems: "center" },
  emptyContainer: { alignItems: "center", marginTop: mvs(100) },
});

export default BluetoothList;
