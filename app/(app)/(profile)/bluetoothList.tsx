import { Card, Text } from "@/components";
import { Colors, Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import { Ionicons } from "@expo/vector-icons";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Modal,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { BleManager, Device, State } from "react-native-ble-plx";

// ─── Singleton BLE manager ────────────────────────────────────────────────────
// One instance is safe to keep alive for the lifetime of the screen.
const bleManager = new BleManager();

// ─── Types ────────────────────────────────────────────────────────────────────

interface DiscoveredDevice {
  id: string;          // MAC (Android) / UUID (iOS)
  name: string;
  rssi: number;
  connectable: boolean;
}

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

/**
 * When a device doesn't broadcast a name we show the last 5 chars of its ID
 * prefixed with "BLE:" so the user can distinguish unnamed devices.
 */
const fallbackName = (id: string) => `BLE:${id.slice(-5).toUpperCase()}`;

/** Request the Android Bluetooth + Location permissions needed for BLE scanning. */
async function requestAndroidPermissions(): Promise<boolean> {
  if (Platform.OS !== "android") return true;

  const apiLevel = Platform.Version as number;

  if (apiLevel >= 31) {
    // Android 12+
    const results = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);
    return Object.values(results).every(
      (r) => r === PermissionsAndroid.RESULTS.GRANTED
    );
  } else {
    // Android 6-11
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    return result === PermissionsAndroid.RESULTS.GRANTED;
  }
}

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
  device: DiscoveredDevice | null;
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
                {status === "connected" ? "Done" : "Cancel"}
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
  const [bleReady, setBleReady] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [scanning, setScanning] = useState(false);

  // Deduplicated device map  id → DiscoveredDevice
  const deviceMap = useRef<Map<string, DiscoveredDevice>>(new Map());
  const [devices, setDevices] = useState<DiscoveredDevice[]>([]);

  const [connectedId, setConnectedId] = useState<string | null>(null);
  const connectedDeviceRef = useRef<Device | null>(null);

  // Modal
  const [selectedDevice, setSelectedDevice] =
    useState<DiscoveredDevice | null>(null);
  const [connStatus, setConnStatus] = useState<ConnectionStatus>("idle");

  // ── BLE state watcher ────────────────────────────────────────────────────

  useEffect(() => {
    const sub = bleManager.onStateChange(async (state) => {
      if (state === State.PoweredOn) {
        const granted = await requestAndroidPermissions();
        if (!granted) {
          setPermissionDenied(true);
          return;
        }
        setBleReady(true);
      } else if (
        state === State.PoweredOff ||
        state === State.Unauthorized
      ) {
        setBleReady(false);
        setScanning(false);
      }
    }, true); // true = emit current state immediately

    return () => {
      sub.remove();
      bleManager.stopDeviceScan();
    };
  }, []);

  // ── Start scanning ────────────────────────────────────────────────────────

  const startScan = useCallback(() => {
    if (!bleReady || scanning) return;

    deviceMap.current.clear();
    setDevices([]);
    setScanning(true);

    bleManager.startDeviceScan(
      null, // scan all service UUIDs
      // allowDuplicates: true is KEY — many devices send their name only
      // in a later advertisement packet, not the first one.
      { allowDuplicates: true },
      (error, device) => {
        if (error) {
          console.warn("[BLE] scan error:", error.message);
          setScanning(false);
          return;
        }
        if (!device) return;

        // Resolve the best available name for this advertisement.
        // Priority: name > localName > previously stored name > short ID
        const incoming = device.name ?? device.localName ?? null;
        const existing = deviceMap.current.get(device.id);
        const resolvedName =
          incoming ||
          (existing && existing.name !== fallbackName(device.id)
            ? existing.name
            : null) ||
          fallbackName(device.id);

        const discovered: DiscoveredDevice = {
          id: device.id,
          name: resolvedName,
          rssi: device.rssi ?? existing?.rssi ?? -100,
          connectable: device.isConnectable ?? true,
        };

        deviceMap.current.set(device.id, discovered);
        // Sort: named devices first, then by signal strength
        const sorted = [...deviceMap.current.values()].sort((a, b) => {
          const aKnown = !a.name.startsWith("BLE:");
          const bKnown = !b.name.startsWith("BLE:");
          if (aKnown !== bKnown) return aKnown ? -1 : 1;
          return b.rssi - a.rssi;
        });
        setDevices(sorted);
      }
    );

    // Auto-stop after 30 s (longer = more names resolved)
    setTimeout(() => {
      bleManager.stopDeviceScan();
      setScanning(false);
    }, 30_000);
  }, [bleReady, scanning]);

  // Auto-start once BLE is ready
  useEffect(() => {
    if (bleReady) startScan();
  }, [bleReady]);

  // ── Connect ───────────────────────────────────────────────────────────────

  const handleConnect = useCallback(
    async (item: DiscoveredDevice) => {
      // Tap connected device → prompt to disconnect
      if (connectedId === item.id && connectedDeviceRef.current) {
        Alert.alert(
          "Disconnect",
          `Disconnect from "${item.name}"?`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Disconnect",
              style: "destructive",
              onPress: async () => {
                try {
                  await connectedDeviceRef.current?.cancelConnection();
                } catch (_) { }
                connectedDeviceRef.current = null;
                setConnectedId(null);
              },
            },
          ]
        );
        return;
      }

      setSelectedDevice(item);
      setConnStatus("connecting");

      // Stop scan while connecting (saves battery + avoids race conditions)
      bleManager.stopDeviceScan();
      setScanning(false);

      try {
        const device = await bleManager.connectToDevice(item.id, {
          timeout: 10_000,
        });
        
        // Trigger OS Bonding/Pairing on Android
        if (Platform.OS === "android") {
          try {
            // Some devices trigger pairing automatically on discovery
            // This is a common trick to force the "Pair?" popup on Android
            await device.discoverAllServicesAndCharacteristics();
          } catch (bondErr) {
            console.warn("[BLE] bonding check failed:", bondErr);
          }
        } else {
          await device.discoverAllServicesAndCharacteristics();
        }

        connectedDeviceRef.current = device;
        setConnectedId(device.id);
        setConnStatus("connected");

        // React to unexpected disconnections
        device.onDisconnected(() => {
          connectedDeviceRef.current = null;
          setConnectedId(null);
        });
      } catch (err: any) {
        console.warn("[BLE] connect error:", err?.message);
        setConnStatus("failed");
      }
    },
    [connectedId]
  );

  const handleModalClose = useCallback(() => {
    setSelectedDevice(null);
    setConnStatus("idle");
  }, []);

  const handleRetry = useCallback(() => {
    if (selectedDevice) handleConnect(selectedDevice);
  }, [selectedDevice, handleConnect]);

  // ── Render device row ────────────────────────────────────────────────────

  const renderItem = ({ item }: { item: DiscoveredDevice }) => {
    const isConnected = connectedId === item.id;
    return (
      <Card
        variant="outlined"
        style={[
          styles.card,
          isConnected && {
            borderColor: Colors.primary ?? "#2563EB",
            borderWidth: 2,
          },
        ]}
        backgroundColor={Colors.white}
        contentStyle={styles.cardContent}
        onPress={() => handleConnect(item)}
      >
        {/* Left */}
        <View style={styles.leftSection}>
          <View
            style={[
              styles.iconContainer,
              isConnected && {
                backgroundColor: Colors.primary ?? "#2563EB",
              },
            ]}
          >
            <Ionicons
              name="bluetooth"
              size={22}
              color={isConnected ? "#fff" : Colors.text}
            />
          </View>
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.nameText,
                isConnected && { color: Colors.primary ?? "#2563EB" },
              ]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <Text
              variant="secondary"
              size="sm"
              style={
                isConnected
                  ? {
                    color: Colors.primary ?? "#2563EB",
                    fontWeight: "500",
                  }
                  : undefined
              }
            >
              {isConnected ? "Connected" : `Signal: ${item.rssi} dBm`}
            </Text>
          </View>
        </View>

        {/* Right */}
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
          Bluetooth and Location permissions are required to scan for
          nearby devices. Please enable them in your device Settings.
        </Text>
      </View>
    );
  }

  // ── BLE not ready (off / unsupported) ────────────────────────────────────

  if (!bleReady && !scanning) {
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
          Please turn on Bluetooth to discover nearby devices.
        </Text>
      </View>
    );
  }

  // ── Initial scanning splash ───────────────────────────────────────────────

  if (scanning && devices.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <View
          style={{
            width: 80,
            height: 80,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <PulseRing />
          <Ionicons
            name="bluetooth"
            size={32}
            color={Colors.primary ?? "#2563EB"}
          />
        </View>
        <Text style={styles.centeredTitle}>Scanning for devices…</Text>
        <Text
          variant="secondary"
          size="sm"
          style={{ textAlign: "center" }}
        >
          Make sure nearby devices are discoverable.
        </Text>
      </View>
    );
  }

  // ── Device list ───────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      {/* Header bar */}
      <View style={styles.headerBar}>
        <Text style={styles.foundText}>
          {devices.length} device{devices.length !== 1 ? "s" : ""} found
        </Text>
        <TouchableOpacity
          style={styles.rescanBtn}
          onPress={startScan}
          disabled={scanning || !bleReady}
        >
          {scanning ? (
            <ActivityIndicator
              size="small"
              color={Colors.primary ?? "#2563EB"}
            />
          ) : (
            <>
              <Ionicons
                name="refresh"
                size={16}
                color={Colors.primary ?? "#2563EB"}
              />
              <Text style={styles.rescanText}>Rescan</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={devices}
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
            <Text
              variant="secondary"
              style={{ marginTop: mvs(12), textAlign: "center" }}
            >
              No Bluetooth devices found.{"\n"}Try moving closer to a
              device.
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

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
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
  foundText: {
    fontWeight: "600",
    color: Colors.text,
  },
  rescanBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: mvs(14),
    paddingVertical: mvs(6),
    borderRadius: 20,
  },
  rescanText: {
    color: Colors.primary ?? "#2563EB",
    fontWeight: "600",
    fontSize: 13,
  },
  listContainer: {
    padding: mvs(20),
    paddingBottom: mvs(40),
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.gray,
    justifyContent: "center",
    alignItems: "center",
    marginRight: mvs(12),
  },
  textContainer: {
    flex: 1,
    paddingRight: mvs(10),
  },
  nameText: {
    fontWeight: "600",
    color: Colors.text,
    marginBottom: mvs(2),
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: mvs(60),
  },
});

export default BluetoothList;
