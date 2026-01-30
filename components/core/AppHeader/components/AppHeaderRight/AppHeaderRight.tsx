import { NotificationBellIcon, QRHistoryIcon } from "@/assets/icons";
import { HapticPressable, Text } from "@/components";
import { View } from "react-native";
import { AppHeaderRightProps } from "./props";
import { styles } from "./styles";

export const AppHeaderRight = ({
  activeTab,
  handleQRPress,
  handleNotificationPress,
}: AppHeaderRightProps) => {
  const notificationCount = 3;
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
    </View>
  );
};

export default AppHeaderRight;
