import { Button, Card, Text } from "@/components";
import { Colors, Spacing } from "@/constants";
import {
  useFactoryResetDevice,
  useDeviceStatusSocket,
  useDeviceTelemetrySocket,
  useReconnectDeviceMqtt,
  useRebootDevice,
} from "@/hooks/api/useQBoxQueries";
import { useProfileLogic } from "./useProfileLogic";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useLocale } from "@/hooks";

const FALLBACK_DEVICE_ID = "TEWPUH775796";

type UsageColor = "cpu" | "ram" | "disk";

const USAGE_COLORS: Record<UsageColor, string> = {
  cpu: "#28475C",
  ram: "#2FA766",
  disk: "#F59E0B",
};

const clampPercentage = (value?: number | null) => {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, value));
};

const formatTimestamp = (value?: string | null) => {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return format(date, "dd MMM yyyy, hh:mm a");
};

const formatUptime = (seconds?: number | null) => {
  if (typeof seconds !== "number" || seconds < 0) return "0s";

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const parts = [
    days > 0 ? `${days}d` : null,
    hours > 0 ? `${hours}h` : null,
    minutes > 0 ? `${minutes}m` : null,
    remainingSeconds > 0 || (days === 0 && hours === 0 && minutes === 0) ? `${remainingSeconds}s` : null,
  ].filter(Boolean);

  return parts.join(" ");
};

const formatNumber = (value?: number | null) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "0.0";
  return value.toFixed(1);
};

interface UsageChartProps {
  label: string;
  value?: number | null;
  color: string;
}

const UsageChart = ({ label, value, color }: UsageChartProps) => {
  const percentage = clampPercentage(value);
  const size = 112;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={styles.chartItem}>
      <View style={styles.chartWrap}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={Colors.gray}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation={-90}
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
        <View style={styles.chartCenter}>
          <Text variant="primary" bold size="lg" style={styles.chartValue}>
            {percentage.toFixed(1)}%
          </Text>
          <Text size="xs" variant="secondary" style={styles.chartLabel}>
            {label}
          </Text>
        </View>
      </View>
    </View>
  );
};

interface StatusPillProps {
  label: string;
  value: string;
  tone: "success" | "danger" | "warning";
  caption?: string;
}

const StatusPill = ({ label, value, tone, caption }: StatusPillProps) => {
  const palette = {
    success: {
      backgroundColor: "#EAF8F0",
      textColor: "#1E7A4E",
    },
    danger: {
      backgroundColor: "#FDECEC",
      textColor: "#B42318",
    },
    warning: {
      backgroundColor: "#FFF5DB",
      textColor: "#995A00",
    },
  }[tone];

  return (
    <View style={[styles.statusPill, { backgroundColor: palette.backgroundColor }]}>
      <Text size="xs" style={[styles.statusLabel, { color: palette.textColor }]}>
        {label}
      </Text>
      <Text bold style={[styles.statusValue, { color: palette.textColor }]}>
        {value}
      </Text>
      {caption ? (
        <Text size="xs" style={[styles.statusCaption, { color: palette.textColor, opacity: 0.8 }]}>
          {caption}
        </Text>
      ) : null}
    </View>
  );
};

interface InfoCardProps {
  label: string;
  value: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
}

const InfoCard = ({ label, value, icon }: InfoCardProps) => {
  return (
    <Card variant="outlined" style={styles.infoCard} contentStyle={styles.infoCardContent}>
      <View style={styles.infoCardIcon}>
        <Ionicons name={icon} size={18} color={Colors.primary} />
      </View>
      <Text size="xs" variant="secondary">
        {label}
      </Text>
      <Text bold style={styles.infoCardValue} numberOfLines={1}>
        {value}
      </Text>
    </Card>
  );
};

export const Telemetry = () => {
  const { t } = useLocale();
  const { profile } = useProfileLogic();
  const deviceId = profile?.qboxes?.[0]?.qbox_id ?? FALLBACK_DEVICE_ID;

  const telemetrySocket = useDeviceTelemetrySocket(deviceId);
  const statusSocket = useDeviceStatusSocket(deviceId);
  const rebootMutation = useRebootDevice(deviceId);
  const factoryResetMutation = useFactoryResetDevice(deviceId);

  const telemetry = telemetrySocket.data;
  const status = statusSocket.data;
  const mqttReconnectMutation = useReconnectDeviceMqtt(deviceId);

  const isLiveConnecting =
    (telemetrySocket.isConnecting && !telemetrySocket.data) ||
    (statusSocket.isConnecting && !statusSocket.data);

  const mqttTone = (() => {
    const normalized = (status?.mqtt_status || "").toLowerCase();
    if (normalized === "connected") return "success" as const;
    if (normalized === "connecting") return "warning" as const;
    return "danger" as const;
  })();
  const isMqttConnected = (status?.mqtt_status || "").toLowerCase() === "connected";

  const wifiTone = telemetry?.network_connected ? ("success" as const) : ("danger" as const);

  const handleReboot = () => {
    Alert.alert(
    t("restartDevice"),
    t("deviceStatusUpdatesAreRefreshedInRealTimeWhenThePageIsOpenPullDownToRefreshManually"),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("restartDevice"),
          style: "destructive",
          onPress: () => rebootMutation.mutate(),
        },
      ]
    );
  };

  const handleFactoryReset = () => {
    Alert.alert(
    t("factoryReset"),
    t("deviceStatusUpdatesAreRefreshedInRealTimeWhenThePageIsOpenPullDownToRefreshManually"),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("factoryReset"),
          style: "destructive",
          onPress: () => factoryResetMutation.mutate(),
        },
      ]
    );
  };

  const handleMqttReconnect = () => {
    mqttReconnectMutation.mutate();
  };

  if (isLiveConnecting && !telemetry && !status) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {isLiveConnecting ? (
        <Card variant="outlined" style={styles.connectingCard} contentStyle={styles.connectingContent}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text size="xs" variant="secondary">
            {t("connectingToLiveUpdates")}
          </Text>
        </Card>
      ) : null}

      <Card variant="filled" backgroundColor={Colors.primary} style={styles.heroCard} contentStyle={styles.heroContent}>
        <View style={styles.heroAccentOne} />
        <View style={styles.heroAccentTwo} />
        <View style={styles.heroTopRow}>
          <View style={styles.heroTitleWrap}>
            <Text bold size="lg" style={styles.heroTitle}>
              {t("deviceMetrics")}
            </Text>
            <Text size="xs" style={styles.heroSubTitle}>
              {t("realTimeDeviceStatusAndHealth")} {deviceId}
            </Text>
          </View>
          <View style={styles.heroIcon}>
            <Ionicons name="pulse-outline" size={28} color={Colors.primary} />
          </View>
        </View>

        <View style={styles.heroMetaRow}>
          <View style={styles.heroMetaChip}>
            <Text size="xs" style={styles.heroMetaText}>
              {status?.status || "Unknown"}
            </Text>
          </View>
          <View style={styles.heroMetaChip}>
            <Text size="xs" style={styles.heroMetaText}>
              MQTT {status?.mqtt_status || "Unknown"}
            </Text>
          </View>
        </View>

        <Text size="xs" style={styles.heroTimestamp}>
          {t("lastUpdate")} {formatTimestamp(status?.last_seen || telemetry?.timestamp)}
        </Text>
      </Card>

      <Card variant="outlined" style={styles.sectionCard} contentStyle={styles.sectionContent}>
        <View style={styles.sectionHeader}>
          <View>
            <Text bold size="lg" style={styles.sectionTitle}>
              {t("connectionStatus")}
            </Text>
            <Text size="xs" variant="secondary">
              {t("wifiAndMqttStatusWithRemoteActions")}
            </Text>
          </View>
          <View style={styles.sectionHeaderActions}>
            <View style={styles.sectionIcon}>
              <Ionicons name="wifi-outline" size={22} color={Colors.primary} />
            </View>
            {!isMqttConnected ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleMqttReconnect}
                disabled={mqttReconnectMutation.isPending}
                style={styles.iconButton}
              >
                <Ionicons
                  name={mqttReconnectMutation.isPending ? "refresh" : "refresh-outline"}
                  size={18}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        <View style={styles.statusRow}>
          <StatusPill
            label="Wi-Fi"
            value={telemetry?.network_connected ? "Connected" : "Disconnected"}
            tone={wifiTone}
            caption={telemetry?.wifi_ssid ? telemetry.wifi_ssid : "SSID not available"}
          />
          <StatusPill
            label="MQTT"
            value={(status?.mqtt_status || "Unknown").replace(/^\w/, (s) => s.toUpperCase())}
            tone={mqttTone}
            caption={formatTimestamp(status?.last_heartbeat_at || status?.last_health_at)}
          />
        </View>

        <View style={styles.actionRow}>
          <View style={styles.actionButtonWrap}>
            <Button
              title="Restart"
              variant="outline"
              fullWidth
              icon={<Ionicons name="refresh-outline" size={18} color={Colors.primary} />}
              onPress={handleReboot}
              loading={rebootMutation.isPending}
              disabled={rebootMutation.isPending || factoryResetMutation.isPending}
            />
          </View>
          <View style={styles.actionButtonWrap}>
            <Button
              title="Factory Reset"
              variant="danger"
              fullWidth
              icon={<Ionicons name="warning-outline" size={18} color={Colors.white} />}
              onPress={handleFactoryReset}
              loading={factoryResetMutation.isPending}
              disabled={factoryResetMutation.isPending || rebootMutation.isPending}
            />
          </View>
        </View>
      </Card>

      <Card variant="outlined" style={styles.sectionCard} contentStyle={styles.sectionContent}>
        <View style={styles.sectionHeader}>
          <View>
            <Text bold size="lg" style={styles.sectionTitle}>
              {t("snapshot")}
            </Text>
            <Text size="xs" variant="secondary">
              {t("quickDeviceDetailsAtAGlance")}
            </Text>
          </View>
          <View style={styles.sectionIcon}>
            <Ionicons name="clipboard-outline" size={22} color={Colors.primary} />
          </View>
        </View>

        <View style={styles.infoGrid}>
          <InfoCard label={t("localIp")} value={telemetry?.local_ip || t("notFound")} icon="phone-portrait-outline" />
          <InfoCard label={t("wifiSsid")} value={telemetry?.wifi_ssid || t("notFound")} icon="wifi-outline" />
          <InfoCard label={t("cpuTemp")} value={`${formatNumber(telemetry?.cpu_temperature)}°C`} icon="thermometer-outline" />
          <InfoCard label={t("uptime")} value={formatUptime(telemetry?.uptime_seconds)} icon="time-outline" />
        </View>

        <View style={styles.snapshotFooter}>
          <Text size="xs" variant="secondary">
            {t("deviceId")}
          </Text>
          <Text bold>{telemetry?.device_id || deviceId}</Text>
        </View>
      </Card>

      <Card variant="outlined" style={styles.sectionCard} contentStyle={styles.sectionContent}>
        <View style={styles.sectionHeader}>
          <View>
            <Text bold size="lg" style={styles.sectionTitle}>
              {t("deviceUsage")}
            </Text>
            <Text size="xs" variant="secondary">
              {t("cpuRamAndDiskUtilizationFromTheLatestTelemetrySample")}
            </Text>
          </View>
          <View style={styles.sectionIcon}>
            <Ionicons name="stats-chart-outline" size={22} color={Colors.primary} />
          </View>
        </View>

        <View style={styles.chartRow}>
          <UsageChart label="CPU" value={telemetry?.cpu_usage} color={USAGE_COLORS.cpu} />
          <UsageChart label="RAM" value={telemetry?.ram_usage} color={USAGE_COLORS.ram} />
          <UsageChart label="Disk" value={telemetry?.disk_usage} color={USAGE_COLORS.disk} />
        </View>
      </Card>

      <View style={styles.footerNote}>
        <Text variant="secondary" size="xs" style={styles.footerNoteText}>
          {t("deviceStatusUpdatesAreRefreshedInRealTimeWhenThePageIsOpenPullDownToRefreshManually")}
        </Text>
      </View>
    </ScrollView>
  );
};

export default Telemetry;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
  connectingCard: {
    borderRadius: 18,
    width: "100%",
  },
  connectingContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  heroCard: {
    borderRadius: 24,
    overflow: "hidden",
  },
  heroContent: {
    position: "relative",
    padding: Spacing.lg,
    gap: Spacing.sm,
    overflow: "hidden",
  },
  heroAccentOne: {
    position: "absolute",
    top: -24,
    right: -18,
    width: 110,
    height: 110,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  heroAccentTwo: {
    position: "absolute",
    bottom: -42,
    left: -28,
    width: 140,
    height: 140,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.md,
    alignItems: "flex-start",
  },
  heroTitleWrap: {
    flex: 1,
    gap: 4,
  },
  heroTitle: {
    color: Colors.white,
    fontSize: 24,
    lineHeight: 30,
  },
  heroSubTitle: {
    color: "rgba(255,255,255,0.85)",
  },
  heroIcon: {
    width: 46,
    height: 46,
    borderRadius: 999,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  heroMetaRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    flexWrap: "wrap",
  },
  heroMetaChip: {
    backgroundColor: "rgba(255,255,255,0.14)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  heroMetaText: {
    color: Colors.white,
  },
  heroTimestamp: {
    color: "rgba(255,255,255,0.82)",
  },
  sectionCard: {
    borderRadius: 20,
  },
  errorCard: {
    borderRadius: 20,
  },
  errorContent: {
    gap: Spacing.md,
  },
  errorHeader: {
    flexDirection: "row",
    gap: Spacing.sm,
    alignItems: "flex-start",
  },
  errorIcon: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: "#FEE4E2",
    alignItems: "center",
    justifyContent: "center",
  },
  errorTextWrap: {
    flex: 1,
    gap: 4,
  },
  errorTitle: {
    color: "#B42318",
  },
  errorMessage: {
    color: "#7A271A",
  },
  sectionContent: {
    gap: Spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  sectionTitle: {
    color: Colors.text,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.gray,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAF0F5",
  },
  statusRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  statusPill: {
    flex: 1,
    borderRadius: 18,
    padding: Spacing.md,
    gap: 4,
  },
  statusLabel: {
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  statusValue: {
    fontSize: 18,
    lineHeight: 24,
  },
  statusCaption: {
    marginTop: 2,
  },
  actionRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    alignItems: "stretch",
  },
  actionButtonWrap: {
    flex: 1,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  infoCard: {
    flexBasis: "48%",
    flexGrow: 1,
    minWidth: "48%",
    borderRadius: 18,
    backgroundColor: Colors.background,
  },
  infoCardContent: {
    gap: 6,
    alignItems: "flex-start",
  },
  infoCardIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#EAF0F5",
    alignItems: "center",
    justifyContent: "center",
  },
  infoCardValue: {
    color: Colors.text,
  },
  snapshotFooter: {
    paddingTop: Spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    gap: 2,
  },
  chartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.sm,
    flexWrap: "wrap",
  },
  chartItem: {
    flexGrow: 1,
    alignItems: "center",
    minWidth: 96,
  },
  chartWrap: {
    width: 112,
    height: 112,
    alignItems: "center",
    justifyContent: "center",
  },
  chartCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  chartValue: {
    lineHeight: 22,
  },
  chartLabel: {
    marginTop: 2,
    textTransform: "uppercase",
  },
  footerNote: {
    paddingHorizontal: 4,
  },
  footerNoteText: {
    textAlign: "center",
  },
});
