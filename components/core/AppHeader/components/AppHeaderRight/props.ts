export interface AppHeaderRightProps {
  activeTab: string;
  handleQRPress: () => void;
  handleNotificationPress: () => void;
  notificationCount?: number;
  handleRefreshPress?: () => void;
  isRefreshLoading?: boolean;
}
