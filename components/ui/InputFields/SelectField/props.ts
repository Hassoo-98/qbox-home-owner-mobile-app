import { Control } from "react-hook-form";
import { StyleProp, ViewStyle } from "react-native";
import { DropdownProps } from "react-native-element-dropdown/lib/typescript/components/Dropdown/model";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectFieldProps
  extends Omit<
    DropdownProps<SelectOption>,
    | "data"
    | "labelField"
    | "valueField"
    | "onChange"
    | "value"
    | "placeholder"
    | "disable"
  > {
  name: string;
  label?: string;
  iconPath?: string;
  required?: boolean;
  options?: SelectOption[];
  control: Control<any>;
  endAdornment?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}
