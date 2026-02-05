import * as SecureStore from "expo-secure-store";
import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext<{
  userToken?: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}>({
  userToken: null,
  login: async () => { },
  logout: async () => { },
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        setUserToken(token);
      } catch (e) {
        console.error("Error while getting token from SecureStore:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  const login = async (token: string) => {
    try {
      await SecureStore.setItemAsync("token", token);
      setUserToken(token);
    } catch (e) {
      console.error("Error while saving token to SecureStore:", e);
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      setUserToken(null);
    } catch (e) {
      console.error("Error while deleting token from SecureStore:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ userToken, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
