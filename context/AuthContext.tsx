import * as SecureStore from "expo-secure-store";
import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext<{
  userToken?: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}>({
  userToken: null,
  login: async () => {},
  logout: async () => {},
  isLoading: true,
});

export const AuthProvider = ({ children }: any) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        setUserToken(token);
      } catch (e) {
        console.log("error while getting token", e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (token: string) => {
    await SecureStore.setItemAsync("token", token);
    setUserToken(token);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
