import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { userApi, getAuthToken, User } from "@/lib/user-api";

interface UserAuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { email: string; password: string; mobile: string; fullName?: string; postalCode?: string; streetName?: string; houseNumber?: string; city?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const UserAuthContext = createContext<UserAuthContextType | null>(null);

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error("useUserAuth must be used within UserAuthProvider");
  }
  return context;
};

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      const response = await userApi.getProfile();
      setUser(response.profile);
      setIsAuthenticated(true);
    } catch {
      // Token invalid or expired
      userApi.logout();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string) => {
    try {
      await userApi.login(email, password);
      await checkAuth();
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      return { success: false, error: message };
    }
  };

  const register = async (data: { email: string; password: string; mobile: string; fullName?: string; postalCode?: string; streetName?: string; houseNumber?: string; city?: string }) => {
    try {
      await userApi.register(data);
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed";
      return { success: false, error: message };
    }
  };

  const logout = () => {
    userApi.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <UserAuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};
