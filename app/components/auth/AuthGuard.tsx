"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { isLoggedIn } from "@/app/services/http.service";

type AuthGuardProps = {
  children: ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated && !isLoggedIn()) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-black text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          <p className="mt-4 text-sm font-semibold text-white/60">
            Cargando...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !isLoggedIn()) {
    return null;
  }

  return <>{children}</>;
}
