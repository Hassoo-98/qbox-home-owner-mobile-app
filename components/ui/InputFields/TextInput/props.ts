import { ButtonProps } from "@/components";
import { Control } from "react-hook-form";
import {
  DimensionValue,
  TextInputProps as RNTextInputProps,
} from "react-native";

export interface TextInputProps extends RNTextInputProps {
  name: string;
  label?: string;
  iconPath?: string;
  required?: boolean;
  width?: DimensionValue;
  endButtonProps?: ButtonProps;
  endIconPath?: any;
  endIcon?: any;
  startIcon?: any;
  startIconPath?: any;
  control: Control<any>;
  onEndIconClick?: () => void;
  onStartIconClick?: () => void;
  endButtonText?: string;
  onEndButtonClick?: () => void;
  placeholder?: string;
}
