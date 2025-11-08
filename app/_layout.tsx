import { Colors, CustomNavigationTheme } from "@/constants";
import { AuthProvider } from "@/context/AuthContext";
import { AppNavigation } from "@/navigation";
import { ThemeProvider } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";

export const RootLayout = () => {
  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync(Colors.white);
      NavigationBar.setButtonStyleAsync("dark");
    }
  }, []);

  return (
    <ThemeProvider value={CustomNavigationTheme}>
      <AuthProvider>
        <AppNavigation />
      </AuthProvider>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
};

export default RootLayout;
