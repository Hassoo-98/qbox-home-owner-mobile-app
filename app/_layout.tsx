import { AuthProvider } from "@/context/AuthContext";
import { AppNavigation } from "@/navigation";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

export const RootLayout = () => {
  return (
    <ThemeProvider value={DefaultTheme}>
      <AuthProvider>
        <AppNavigation />
      </AuthProvider>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
};

export default RootLayout;
