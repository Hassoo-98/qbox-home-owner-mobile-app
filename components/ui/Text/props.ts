import { ElementSize, ElementVariant, FontVariants } from "@/constants";
import { ColorValue, TextProps as RNTextProps } from "react-native";

export type TextProps = {
  children: React.ReactNode;
  size?: ElementSize;
  variant?: ElementVariant;
  font?: FontVariants;
  bold?: boolean;
  color?: ColorValue;
} & RNTextProps;
