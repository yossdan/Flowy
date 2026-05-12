"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  getCurrentUserRequest,
  getStoredAuthUser,
  logout,
  saveAuthUser,
  type AuthUser,
} from "@/app/services/auth.service";
import { getApiUrl, isLoggedIn } from "@/app/services/http.service";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  refreshUser: () => Promise<AuthUser | null>;
  logoutUser: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    if (!isLoggedIn()) {
      setUser(null);
      setLoading(false);
      return null;
    }

    const storedUser = getStoredAuthUser();

    if (storedUser) {
      setUser(storedUser);
    }

    if (!getApiUrl()) {
      setLoading(false);
      return storedUser;
    }

    try {
      const currentUser = await getCurrentUserRequest();

      setUser(currentUser);
      saveAuthUser(currentUser);

      return currentUser;
    } catch (error) {
      console.warn("No se pudo obtener el usuario actual:", error);

      if (storedUser) {
        setUser(storedUser);
        return storedUser;
      }

      logout();
      setUser(null);
      router.replace("/login");

      return null;
    } finally {
      setLoading(false);
    }
  }

  function logoutUser() {
    logout();
    setUser(null);
    router.replace("/login");
  }

  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user) || isLoggedIn(),
      setUser,
      refreshUser,
      logoutUser,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}
