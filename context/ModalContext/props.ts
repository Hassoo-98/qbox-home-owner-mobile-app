import { ReactNode } from "react";

export interface ModalProviderProps {
  children: ReactNode;
}

export type ModalStateType = {
  icon?: ReactNode | string;
  title: string;
  subtitle?: string;
  primaryButtonText?: string;
  primaryButtonHandler: () => void;
  secondaryButtonText?: string;
  secondaryButtonHandler?: () => void;
};

export type ModalContextType = {
  isOpen: boolean;
  onClose: () => void;
  setLoading: (isLoading: boolean) => void;
  onOpen: (values: ModalStateType) => void;
};
