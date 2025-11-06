import { Control } from "react-hook-form";
import { TextInputProps as RNTextInputProps } from "react-native";

export interface PasswordInputProps extends RNTextInputProps {
  name: string;
  label?: string;
  iconPath?: string;
  required?: boolean;
  control: Control<any>;
  placeholder?: string;
}
