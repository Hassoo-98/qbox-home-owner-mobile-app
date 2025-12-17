import { Colors, CustomNavigationTheme } from "@/constants";
import { ModalProvider } from "@/context";
import { AuthProvider } from "@/context/AuthContext";
import { AppNavigation } from "@/navigation";
import { ThemeProvider } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import React, { useEffect } from "react";
import { I18nManager, Platform, StatusBar, StyleSheet, View } from "react-native";
import ToastManager from "toastify-react-native";

I18nManager.forceRTL(false);
I18nManager.allowRTL(false);

export const RootLayout = () => {
  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync(Colors.white);
      NavigationBar.setButtonStyleAsync("dark");
    }
  }, []);

  return (
    <View style={styles.container}>
      <ThemeProvider value={CustomNavigationTheme}>
        <AuthProvider>
          <ModalProvider>
            <AppNavigation />
          </ModalProvider>
        </AuthProvider>
        <StatusBar style="dark" />
      </ThemeProvider>

      <ToastManager />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default RootLayout;
