import { ReactNode } from "react";

export interface ModalProps {
  icon?: ReactNode | string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  subtitle?: string;
  isLoading: boolean;
  primaryButtonText?: string;
  primaryButtonHandler: () => void;
  secondaryButtonText?: string;
  secondaryButtonHandler?: () => void;
}
