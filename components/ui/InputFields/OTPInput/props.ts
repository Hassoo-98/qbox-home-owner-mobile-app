import { Control, RegisterOptions } from "react-hook-form";

export interface OTPInputProps {
  name: string;
  label?: string;
  iconPath?: string;
  control: Control<any>;
  numberOfDigits?: number;
  rules?: RegisterOptions;
}
