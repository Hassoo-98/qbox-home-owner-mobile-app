export interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  authOption?: string;
  authValue?: string;
  footerAction?: string;
  footerText?: string;
  subtitle?: string;
  title: string;
  isForgotPassowrd?: boolean;
  onSubmit: () => void;
  secondaryButtonHandler?: () => void;
  isLoading?: boolean;
  primaryButtonText?: string;
}
