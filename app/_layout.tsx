import { Colors, CustomNavigationTheme } from "@/constants";
import { BleProvisioningProvider, LocaleProvider, ModalProvider } from "@/context";
import { AuthProvider } from "@/context/AuthContext";
import { AppNavigation } from "@/navigation";
import { ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as NavigationBar from "expo-navigation-bar";
import React, { useEffect } from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import ToastManager from "toastify-react-native";

const queryClient = new QueryClient();

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
          <LocaleProvider>
            <AuthProvider>
              <BleProvisioningProvider>
                <ModalProvider>
                  <AppNavigation />
                </ModalProvider>
              </BleProvisioningProvider>
            </AuthProvider>
          </LocaleProvider>
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
