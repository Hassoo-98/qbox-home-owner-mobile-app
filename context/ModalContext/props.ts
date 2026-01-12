import { ReactNode } from "react";

export interface ModalProviderProps {
  children: ReactNode;
}

export type ModalStateType = {
  icon?: ReactNode | string;
  title: string;
  footerAction?: string;
  footerText?: string;
  subtitle?: string;
  primaryButtonText?: string;
  primaryButtonHandler: () => void;
  secondaryButtonText?: string;
  secondaryButtonHandler?: () => void;
  modalType?: "default" | "otp";
  isForgotPassowrd?: boolean;
  onOTPResend?: () => void;
};

export type ModalContextType = {
  isOpen: boolean;
  onClose: () => void;
  onRequestOTP: () => void;
  setLoading: (isLoading: boolean) => void;
  onOpen: (values: ModalStateType) => void;
};

export interface ModalProps {
  icon?: ReactNode | string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  subtitle?: string;
  isLoading?: boolean;
  primaryButtonText?: string;
  primaryButtonHandler: () => void;
  secondaryButtonText?: string;
  secondaryButtonHandler?: () => void;
}
