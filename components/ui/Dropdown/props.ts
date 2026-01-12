import { Control, FieldValues, Path } from "react-hook-form";
import { ViewStyle } from "react-native";

export interface OptionType {
  label: string;
  value: string;
}

export interface SelectFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  options: OptionType[];
  search?: boolean;
  searchPlaceholder?: string;
  maxHeight?: number;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  dropdownStyle?: ViewStyle;
  containerStyle?: ViewStyle;
}
