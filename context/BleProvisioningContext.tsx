import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import { Platform, PermissionsAndroid } from "react-native";
import {
  BleManager,
  Device,
  State,
  Subscription,
} from "react-native-ble-plx";
import { Buffer } from "buffer";

// ─── Constants ────────────────────────────────────────────────────────────────

// Always use lowercase for UUID comparisons to avoid platform inconsistencies
export const SMART_LOCKER_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e".toLowerCase();
export const COMMAND_CHAR_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e".toLowerCase();
export const RESPONSE_CHAR_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e".toLowerCase();

const DEFAULT_TIMEOUT_MS = 15000;
const WIFI_CONNECT_TIMEOUT_MS = 45000;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DiscoveredBleDevice {
  id: string;
  name: string;
  rssi: number;
  device: Device;
}

interface BleProvisioningContextType {
  bleReady: boolean;
  isScanning: boolean;
  scanResults: DiscoveredBleDevice[];
  connectedDevice: Device | null;
  startScan: () => void;
  stopScan: () => void;
  connect: (device: Device) => Promise<Device>;
  disconnect: () => Promise<void>;
  sendBleCommand: (payload: any) => Promise<any>;
  requestPermissions: () => Promise<boolean>;
}

const BleProvisioningContext = createContext<BleProvisioningContextType | undefined>(
  undefined
);

// ─── Provider ─────────────────────────────────────────────────────────────────

const bleManager = new BleManager();

export const BleProvisioningProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [bleReady, setBleReady] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<DiscoveredBleDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

  const deviceMap = useRef<Map<string, DiscoveredBleDevice>>(new Map());
  const monitorSubscription = useRef<Subscription | null>(null);

  // ── Command Pending State ──────────────────────────────────────────────────
  const pendingResolve = useRef<((value: any) => void) | null>(null);
  const pendingReject = useRef<((reason?: any) => void) | null>(null);
  const pendingTimeout = useRef<NodeJS.Timeout | null>(null);

  const clearPending = useCallback(() => {
    if (pendingTimeout.current) {
      clearTimeout(pendingTimeout.current);
      pendingTimeout.current = null;
    }
    pendingResolve.current = null;
    pendingReject.current = null;
  }, []);

  // ── Debug Helpers ─────────────────────────────────────────────────────────

  const debugBleServices = async (device: Device) => {
    try {
      const services = await device.services();
      console.log("[BleProvisioning] Discovered services:", services.length);
      for (const service of services) {
        const uuid = service.uuid.toLowerCase();
        console.log("  Service UUID:", uuid);
        const chars = await service.characteristics();
        for (const char of chars) {
          console.log("    Char UUID:", char.uuid.toLowerCase(), {
            readable: char.isReadable,
            writableResponse: char.isWritableWithResponse,
            writableNoResponse: char.isWritableWithoutResponse,
            notifiable: char.isNotifiable,
          });
        }
      }
    } catch (e) {
      console.warn("[BleProvisioning] Debug services failed:", e);
    }
  };

  const assertSmartLockerGatt = async (device: Device) => {
    const services = await device.services();
    const hasService = services.some(s => s.uuid.toLowerCase() === SMART_LOCKER_SERVICE_UUID);
    if (!hasService) {
      throw new Error(`Device missing SmartLocker service: ${SMART_LOCKER_SERVICE_UUID}`);
    }
  };

  // ── Response Decoding ──────────────────────────────────────────────────────

  const decodeBase64Json = useCallback((base64Value: string) => {
    try {
      // Clean null characters and trim whitespace
      const text = Buffer.from(base64Value, "base64")
        .toString("utf8")
        .replace(/\0/g, "")
        .trim();
      
      console.log("[BleProvisioning] Raw response text:", text);
      if (!text) throw new Error("Empty BLE response text");
      
      return JSON.parse(text);
    } catch (e) {
      console.error("[BleProvisioning] Decode/Parse error:", e);
      throw e;
    }
  }, []);

  // ── Fallback Read with Polling ─────────────────────────────────────────────

  const readResponseFallback = useCallback(async (device: Device) => {
    console.log("[BleProvisioning] Starting read fallback polling...");
    for (let i = 0; i < 3; i++) {
      try {
        const characteristic = await device.readCharacteristicForService(
          SMART_LOCKER_SERVICE_UUID,
          RESPONSE_CHAR_UUID
        );
        if (characteristic?.value) {
          console.log("[BleProvisioning] Read fallback success on attempt", i + 1);
          return decodeBase64Json(characteristic.value);
        }
      } catch (e) {
        console.warn(`[BleProvisioning] Read fallback attempt ${i + 1} failed:`, e);
      }
      await sleep(500);
    }
    throw new Error("Empty BLE response characteristic after polling");
  }, [decodeBase64Json]);

  // ── Permissions ────────────────────────────────────────────────────────────

  const requestPermissions = async (): Promise<boolean> => {
    if (Platform.OS !== "android") return true;

    const apiLevel = Platform.Version as number;
    if (apiLevel >= 31) {
      const results = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
      return Object.values(results).every(
        (r) => r === PermissionsAndroid.RESULTS.GRANTED
      );
    } else {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return result === PermissionsAndroid.RESULTS.GRANTED;
    }
  };

  // ── BLE State ──────────────────────────────────────────────────────────────

  useEffect(() => {
    const subscription = bleManager.onStateChange((state) => {
      setBleReady(state === State.PoweredOn);
    }, true);
    return () => subscription.remove();
  }, []);

  // ── Scanning ───────────────────────────────────────────────────────────────

  const startScan = useCallback(() => {
    if (!bleReady || isScanning) return;

    deviceMap.current.clear();
    setScanResults([]);
    setIsScanning(true);

    bleManager.startDeviceScan(
      [SMART_LOCKER_SERVICE_UUID],
      { allowDuplicates: false },
      (error, device) => {
        if (error) {
          console.error("[BleProvisioning] Scan error:", error);
          setIsScanning(false);
          return;
        }
        if (device) {
          const name = device.localName || device.name || "SmartLocker Device";
          if (name.startsWith("SmartLocker-") || name === "SmartLocker Device") {
            const discovered: DiscoveredBleDevice = {
              id: device.id,
              name,
              rssi: device.rssi ?? -100,
              device,
            };
            deviceMap.current.set(device.id, discovered);
            setScanResults(Array.from(deviceMap.current.values()));
          }
        }
      }
    );

    setTimeout(() => {
      stopScan();
    }, 30000);
  }, [bleReady, isScanning]);

  const stopScan = useCallback(() => {
    bleManager.stopDeviceScan();
    setIsScanning(false);
  }, []);

  // ── Connection ─────────────────────────────────────────────────────────────

  const setupResponseListener = useCallback((device: Device) => {
    if (monitorSubscription.current) {
      monitorSubscription.current.remove();
      monitorSubscription.current = null;
    }

    monitorSubscription.current = device.monitorCharacteristicForService(
      SMART_LOCKER_SERVICE_UUID,
      RESPONSE_CHAR_UUID,
      (error, characteristic) => {
        if (error) {
          console.error("[BleProvisioning] Notify error:", error);
          if (pendingReject.current) {
            const reject = pendingReject.current;
            clearPending();
            reject(error);
          }
          return;
        }
        if (characteristic?.value) {
          try {
            const data = decodeBase64Json(characteristic.value);
            console.log("[BleProvisioning] Notify received valid JSON:", data.status);
            if (pendingResolve.current) {
              const resolve = pendingResolve.current;
              clearPending();
              resolve(data);
            }
          } catch (e) {
            console.warn("[BleProvisioning] Notify parse failed:", e);
          }
        }
      }
    );
  }, [decodeBase64Json, clearPending]);

  const connect = async (device: Device): Promise<Device> => {
    stopScan();
    try {
      console.log("[BleProvisioning] Connecting to device:", device.id);
      let connected = await device.connect();
      connected = await connected.discoverAllServicesAndCharacteristics();

      if (Platform.OS === "android") {
        try {
          console.log("[BleProvisioning] Requesting MTU 512...");
          connected = await connected.requestMTU(512);
        } catch (mtuErr) {
          console.log("[BleProvisioning] MTU request skipped:", mtuErr);
        }
      }

      await debugBleServices(connected);
      await assertSmartLockerGatt(connected);
      
      setupResponseListener(connected);
      setConnectedDevice(connected);

      // Give the hardware a moment to stabilize the listener
      await sleep(300);
      
      return connected;
    } catch (e) {
      console.error("[BleProvisioning] Connection error:", e);
      throw e;
    }
  };

  const disconnect = async () => {
    if (connectedDevice) {
      try {
        await connectedDevice.cancelConnection();
      } catch (e) {
        console.warn("[BleProvisioning] Disconnect error:", e);
      }
      setConnectedDevice(null);
    }
    if (monitorSubscription.current) {
      monitorSubscription.current.remove();
      monitorSubscription.current = null;
    }
    clearPending();
  };

  // ── Communication ──────────────────────────────────────────────────────────

  const sendBleCommand = async (payload: any): Promise<any> => {
    if (!connectedDevice) throw new Error("No BLE device connected");
    if (pendingResolve.current || pendingReject.current) {
      throw new Error("Another BLE command is already pending");
    }

    const action = payload?.action;
    const timeoutMs = action === "connect_wifi" ? WIFI_CONNECT_TIMEOUT_MS : DEFAULT_TIMEOUT_MS;

    return new Promise(async (resolve, reject) => {
      pendingResolve.current = resolve;
      pendingReject.current = reject;

      pendingTimeout.current = setTimeout(async () => {
        console.log(`[BleProvisioning] Command '${action}' timed out, trying read fallback...`);
        try {
          const fallbackResponse = await readResponseFallback(connectedDevice!);
          const originalResolve = pendingResolve.current;
          clearPending();
          originalResolve?.(fallbackResponse);
        } catch (e: any) {
          const originalReject = pendingReject.current;
          clearPending();
          originalReject?.(new Error(`BLE response timeout: ${e?.message || e}`));
        }
      }, timeoutMs);

      try {
        const jsonString = JSON.stringify(payload);
        const base64Payload = Buffer.from(jsonString, "utf8").toString("base64");

        console.log(`[BleProvisioning] Writing command: ${action}`);
        
        // Find characteristic to check write flags
        const chars = await connectedDevice.characteristicsForService(SMART_LOCKER_SERVICE_UUID);
        const commandChar = chars.find(c => c.uuid.toLowerCase() === COMMAND_CHAR_UUID);
        
        if (commandChar?.isWritableWithResponse) {
          await connectedDevice.writeCharacteristicWithResponseForService(
            SMART_LOCKER_SERVICE_UUID,
            COMMAND_CHAR_UUID,
            base64Payload
          );
        } else {
          await connectedDevice.writeCharacteristicWithoutResponseForService(
            SMART_LOCKER_SERVICE_UUID,
            COMMAND_CHAR_UUID,
            base64Payload
          );
        }
      } catch (error) {
        const originalReject = pendingReject.current;
        clearPending();
        originalReject?.(error);
      }
    });
  };

  // ── Cleanup ────────────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      stopScan();
      disconnect();
    };
  }, []);

  return (
    <BleProvisioningContext.Provider
      value={{
        bleReady,
        isScanning,
        scanResults,
        connectedDevice,
        startScan,
        stopScan,
        connect,
        disconnect,
        sendBleCommand,
        requestPermissions,
      }}
    >
      {children}
    </BleProvisioningContext.Provider>
  );
};

export const useBleProvisioning = () => {
  const context = useContext(BleProvisioningContext);
  if (context === undefined) {
    throw new Error(
      "useBleProvisioning must be used within a BleProvisioningProvider"
    );
  }
  return context;
};
