import { DefaultTheme } from "@react-navigation/native";
import { Colors } from "./theme";

export const CustomNavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary, // #28475C
    background: Colors.white, // #fff
    card: Colors.background, // #fff - for headers, tab bars
    text: Colors.text, // #1C1E24
    border: "#E5E5E5", // Light border color
    notification: Colors.danger, // #c70000
  },
};
