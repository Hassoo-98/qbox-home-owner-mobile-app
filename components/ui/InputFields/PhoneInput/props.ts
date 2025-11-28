import { ButtonProps } from "@/components";
import { Control } from "react-hook-form";
import { PhoneInputProps as RNPhoneInputProps } from "react-native-phone-number-input";

export interface PhoneInputProps extends Partial<RNPhoneInputProps> {
  name: string;
  label?: string;
  iconPath?: string;
  control: Control<any>;
  placeholder?: string;
  endButtonText?: string;
  onEndButtonClick?: () => void;
  endButtonProps?: ButtonProps;
}
