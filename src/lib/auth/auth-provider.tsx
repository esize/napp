"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { TokenPayload } from "@/types/auth";

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

  // Function to refresh user data from server
  const refreshUser = async () => {
    try {
      setIsLoading(true);
      // We'll need to expose this as an API endpoint or server action
      // that's callable from client components
      const refreshedUser = await fetch("/api/auth/me").then((res) =>
        res.json()
      );
      setUser(refreshedUser.user);
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
