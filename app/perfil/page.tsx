"use client";

import { useState } from "react";
import { useProfile } from "@/app/hooks/useProfileData";
import type { PerfilTab } from "@/app/types/profile";
import ProfileScreen from "@/app/components/profile/ProfileScreen";

export default function PerfilPage() {
  const { data, loading, error } = useProfile();
  const [activeTab, setActiveTab] = useState<PerfilTab>("playlists");

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-black text-white">
        Cargando perfil...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="grid min-h-screen place-items-center bg-black text-white">
        No se pudo cargar el perfil.
      </div>
    );
  }

  return (
    <ProfileScreen
      data={data}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    />
  );
}
