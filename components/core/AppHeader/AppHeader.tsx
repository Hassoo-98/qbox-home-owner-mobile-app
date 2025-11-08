import { NotificationBellIcon, QRHistoryIcon } from "@/assets/icons";
import { Text } from "@/components";
import { View } from "react-native";
import { HapticPressable } from "../HapticPressable";
import { AppHeaderRightProps, AppHeaderTitleProps } from "./props";
import { styles } from "./styles";

export const AppHeaderRight = ({
  activeTab,
  handleQRPress,
  handleNotificationPress,
}: AppHeaderRightProps) => {
  const notificationCount = 5;
  return (
    <View style={styles.headerRight}>
      {activeTab === "home" && (
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

export const AppHeaderTitle = ({ title }: AppHeaderTitleProps) => {
  return (
    <Text style={styles.headerTitle} size="lg">
      {title}
    </Text>
  );
};
