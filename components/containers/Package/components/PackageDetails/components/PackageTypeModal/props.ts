export interface PackageTypeModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (type: "send" | "return") => void;
}

export interface OptionCardProps {
  icon: React.ReactNode;
  label: string;
  isSelected: boolean;
  onPress: () => void;
}
