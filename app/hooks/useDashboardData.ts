"use client";

import { useEffect, useState } from "react";
import type { DashboardData } from "@/app/types/dashboard";
import { getDashboardData } from "@/app/services/dashboard.service";

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const result = await getDashboardData();
        setData(result);
      } catch (err) {
        setError("No se pudo cargar el dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return { data, loading, error };
}