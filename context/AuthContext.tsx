import { HomeOwner } from "@/services/api/homeOwner";
import * as Auth from "@/services/api/modules/auth";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext<{
  userToken?: string | null;
  user?: HomeOwner | null;
  login: (data: { tokens: { access: string; refresh: string }, user: HomeOwner }) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}>({
  userToken: null,
  user: null,
  login: async () => { },
  logout: async () => { },
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<HomeOwner | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        const userData = await SecureStore.getItemAsync("user");

        setUserToken(token);
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (e) {
        console.error("Error while getting data from SecureStore:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const login = async (data: { tokens: { access: string; refresh: string }, user: HomeOwner }) => {
    try {
      await SecureStore.setItemAsync("token", data.tokens.access);
      await SecureStore.setItemAsync("refresh_token", data.tokens.refresh);
      await SecureStore.setItemAsync("user", JSON.stringify(data.user));

      setUserToken(data.tokens.access);
      setUser(data.user);
    } catch (e) {
      console.error("Error while saving data to SecureStore:", e);
    }
  };

  const logout = async () => {
    try {
      try {
        await Auth.logoutHomeOwner();
      } catch (error) {
        console.warn("Logout API request failed, continuing local sign-out:", error);
      }

      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("refresh_token");
      await SecureStore.deleteItemAsync("user");
      setUserToken(null);
      setUser(null);
    } catch (e) {
      console.error("Error while deleting data from SecureStore:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ userToken, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
