import { Colors, CustomNavigationTheme } from "@/constants";
import { BleProvisioningProvider, ModalProvider } from "@/context";
import { AuthProvider } from "@/context/AuthContext";
import { AppNavigation } from "@/navigation";
import { ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as NavigationBar from "expo-navigation-bar";
import React, { useEffect } from "react";
import {
  I18nManager,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import ToastManager from "toastify-react-native";

const queryClient = new QueryClient();

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
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={CustomNavigationTheme}>
          <AuthProvider>
            <BleProvisioningProvider>
              <ModalProvider>
                <AppNavigation />
              </ModalProvider>
            </BleProvisioningProvider>
          </AuthProvider>
          <StatusBar barStyle="dark-content" />
        </ThemeProvider>
      </QueryClientProvider>

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
