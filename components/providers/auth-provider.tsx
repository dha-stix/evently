"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { isFirebaseConfigured } from "@/lib/firebase";
import { loginUser, logoutUser, registerUser, subscribeToAuth } from "@/lib/firebase-actions";
import type { User } from "@/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Keeps the signed-in Firebase user in React state for the whole app. */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      console.warn("Firebase isn’t configured. Add your keys to .env.local (see .env.example).");
      return;
    }
    return subscribeToAuth((u) => {
      // Keep the username set during sign-up if Firebase reports the user before the profile update lands.
      setUser((prev) => (u && prev?.id === u.id ? { ...u, username: prev.username } : u));
      setLoading(false);
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setUser(await loginUser(email, password));
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    setUser(await registerUser(username, email, password));
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
