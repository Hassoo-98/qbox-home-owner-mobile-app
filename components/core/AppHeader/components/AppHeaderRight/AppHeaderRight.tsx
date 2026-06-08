import { NotificationBellIcon, QRHistoryIcon } from "@/assets/icons";
import { HapticPressable, Text } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { AppHeaderRightProps } from "./props";
import { styles } from "./styles";

export const AppHeaderRight = ({
  activeTab,
  handleQRPress,
  handleNotificationPress,
  notificationCount = 0,
  handleRefreshPress,
  isRefreshLoading,
}: AppHeaderRightProps) => {
  return (
    <View style={styles.headerRight}>
      {activeTab === "(home-screens)" && (
        <HapticPressable onPress={handleQRPress}>
          <QRHistoryIcon width={24} height={24} />
        </HapticPressable>
      )}

      <HapticPressable onPress={handleNotificationPress}>
        <NotificationBellIcon width={24} height={24} />
        {notificationCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {notificationCount > 99 ? "99+" : notificationCount}
            </Text>
          </View>
        )}
      </HapticPressable>

      {activeTab === "(myQbox)" && handleRefreshPress ? (
        <HapticPressable onPress={handleRefreshPress} disabled={!!isRefreshLoading}>
          <Ionicons
            name={isRefreshLoading ? "refresh" : "refresh-outline"}
            size={24}
            color="#28475C"
          />
        </HapticPressable>
      ) : null}
    </View>
  );
};

export default AppHeaderRight;
