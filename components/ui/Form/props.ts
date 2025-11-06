import { ReactNode } from "react";
import { ScrollViewProps, ViewStyle } from "react-native";

export interface FormProps extends Omit<ScrollViewProps, "children"> {
  style?: ViewStyle;
  children: ReactNode;
  keyboardShouldPersistTaps?: "always" | "never" | "handled";
  showsVerticalScrollIndicator?: boolean;
}
