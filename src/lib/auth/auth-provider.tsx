"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { TokenPayload } from "@/types/auth";

import { refreshUser as refreshUserAction } from "@/actions/auth";

interface AuthContextType {
  user: TokenPayload | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: TokenPayload | null;
}) {
  const [user, setUser] = useState<TokenPayload | null>(initialUser);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshUser = async () => {
    try {
      setIsLoading(true);
      const [result] = await refreshUserAction();
      if (result?.user) {
        setUser(result.user);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for focus events to refresh the user data
  // This helps keep auth state in sync when a user returns to your app
  useEffect(() => {
    const onFocus = () => {
      refreshUser();
    };

    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
