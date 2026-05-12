"use client";

import { useState } from "react";
import type { Tab, View } from "@/app/types/dashboard";
import DashboardScreen from "@/app/components/dashboard/DashboardScreen";
import { useDashboard } from "@/app/hooks/useDashboardData";

export default function DashboardPage() {
  const { data, loading, error } = useDashboard();

  const [tab, setTab] = useState<Tab>("musica");
  const [view, setView] = useState<View>("home");

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-black text-white">
        Cargando...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="grid min-h-screen place-items-center bg-black text-white">
        No se pudo cargar el dashboard.
      </div>
    );
  }

  return (
    <DashboardScreen
      userName={data.userName}
      createdFor={data.createdFor}
      mostPlayed={data.mostPlayed}
      tab={tab}
      setTab={setTab}
      view={view}
      setView={setView}
    />
  );
}
