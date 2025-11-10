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
  endIconPath?: any;
  startIconPath?: any;
  control: Control<any>;
  onEndIconClick?: () => void;
  onStartIconClick?: () => void;
  endButtonText?: string;
  onEndButtonClick?: () => void;
  placeholder?: string;
}
