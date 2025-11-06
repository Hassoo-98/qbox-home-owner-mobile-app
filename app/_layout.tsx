import { CustomNavigationTheme } from "@/constants";
import { AuthProvider } from "@/context/AuthContext";
import { AppNavigation } from "@/navigation";
import { ThemeProvider } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

export const RootLayout = () => {
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
