import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  DeviceStatusResponse,
  DeviceTelemetryResponse,
} from "@/services/api/types";

const WS_BASE_URL = "wss://backend.qbox.sa/ws/devices";
const MAX_BACKOFF_MS = 30000;
const INITIAL_BACKOFF_MS = 1000;

type DeviceSocketMessage<T> = {
  type: string;
  device_id: string;
  timestamp: string;
  payload: T;
};

const getBackoffDelay = (attempt: number) => {
  return Math.min(MAX_BACKOFF_MS, INITIAL_BACKOFF_MS * 2 ** attempt);
};

const useDeviceSocket = <T,>({
  deviceId,
  socketPath,
  messageType,
  queryKey,
}: {
  deviceId: string;
  socketPath: "status" | "telemetry";
  messageType: "device.status" | "device.telemetry";
  queryKey: string;
}) => {
  const queryClient = useQueryClient();
  const [data, setData] = useState<T | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [lastTimestamp, setLastTimestamp] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryAttemptRef = useRef(0);
  const isUnmountedRef = useRef(false);

  useEffect(() => {
    const cleanupSocket = () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }

      if (socketRef.current) {
        try {
          socketRef.current.onopen = null;
          socketRef.current.onmessage = null;
          socketRef.current.onerror = null;
          socketRef.current.onclose = null;
          socketRef.current.close(1000, "cleanup");
        } catch {
          // Ignore cleanup errors.
        }
        socketRef.current = null;
      }
    };

    if (!deviceId) {
      cleanupSocket();
      setData(null);
      setIsConnecting(false);
      setIsConnected(false);
      setLastTimestamp(null);
      return;
    }

    isUnmountedRef.current = false;

    const connect = () => {
      if (isUnmountedRef.current) {
        return;
      }

      cleanupSocket();
      setIsConnecting(true);

      const url = `${WS_BASE_URL}/${encodeURIComponent(deviceId)}/${socketPath}/`;
      const socket = new WebSocket(url);
      socketRef.current = socket;

      socket.onopen = () => {
        if (isUnmountedRef.current) {
          return;
        }

        setIsConnected(true);
      };

      socket.onmessage = (event) => {
        if (isUnmountedRef.current) {
          return;
        }

        try {
          const parsed = JSON.parse(event.data) as DeviceSocketMessage<T>;
          if (parsed?.type !== messageType || parsed?.device_id !== deviceId) {
            return;
          }

          setData(parsed.payload);
          setLastTimestamp(parsed.timestamp || null);
          setIsConnecting(false);
          setIsConnected(true);
          retryAttemptRef.current = 0;
          queryClient.setQueryData([queryKey, deviceId], parsed.payload);
        } catch {
          // Ignore malformed websocket payloads.
        }
      };

      socket.onerror = () => {
        if (isUnmountedRef.current) {
          return;
        }

        setIsConnected(false);
        setIsConnecting(false);
      };

      socket.onclose = () => {
        if (isUnmountedRef.current) {
          return;
        }

        setIsConnected(false);

        const delay = getBackoffDelay(retryAttemptRef.current);
        retryAttemptRef.current += 1;

        setIsConnecting(true);
        if (retryTimerRef.current) {
          clearTimeout(retryTimerRef.current);
        }

        retryTimerRef.current = setTimeout(() => {
          connect();
        }, delay);
      };
    };

    connect();

    return () => {
      isUnmountedRef.current = true;
      cleanupSocket();
    };
  }, [deviceId, socketPath, messageType, queryClient, queryKey]);

  return {
    data,
    isConnecting,
    isConnected,
    lastTimestamp,
  };
};

export const useDeviceStatusSocket = (deviceId: string) => {
  return useDeviceSocket<DeviceStatusResponse>({
    deviceId,
    socketPath: "status",
    messageType: "device.status",
    queryKey: "device-status",
  });
};

export const useDeviceTelemetrySocket = (deviceId: string) => {
  return useDeviceSocket<DeviceTelemetryResponse>({
    deviceId,
    socketPath: "telemetry",
    messageType: "device.telemetry",
    queryKey: "device-telemetry",
  });
};
