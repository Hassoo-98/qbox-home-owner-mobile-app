import { TextProps } from "@/components/ui";
import { ViewStyle } from "react-native";

export interface ItemInfoProps {
  title: string;
  description: string;
  style?: ViewStyle;
  titleProps?: Omit<TextProps, "children">;
  descriptionProps?: Omit<TextProps, "children">;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
}
