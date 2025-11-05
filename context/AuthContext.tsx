import * as SecureStore from "expo-secure-store";
import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext<{
  userToken?: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}>({
  userToken: null,
  login: async (token: string) => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: any) => {
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync("token");
      setUserToken(token);
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
    <AuthContext.Provider value={{ userToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
