export interface QBoxAlarmCardProps {
  isEnabled: boolean;
  onToggle: () => void;
  timerText?: string;
  isLoading?: boolean;
}
