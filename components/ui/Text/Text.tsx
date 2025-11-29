import { Fonts } from "@/constants";
import { Text as RNText } from "react-native";
import { TextProps } from "./props";
import { styles } from "./styles";

export const Text = ({
  children,
  size = "md",
  variant = "default",
  font = "default",
  bold,
  color,
  style,
  ...restProps
}: TextProps) => {
  const variantStyle = styles[variant];
  const sizeStyle = styles[size];
  const fontFamily = Fonts[font];

  return (
    <RNText
      {...restProps}
      style={[
        styles.base,
        {
          fontFamily,
          ...(bold && { fontWeight: "bold" }),
          ...(color && { color }),
        },
        sizeStyle,
        variantStyle,
        style,
      ]}
    >
      {children}
    </RNText>
  );
};
