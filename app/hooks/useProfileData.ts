"use client";

import { useEffect, useState } from "react";
import type { ProfileData } from "@/app/types/profile";
import { getProfileData } from "@/app/services/profile.service";

export function useProfile() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const result = await getProfileData();
        setData(result);
      } catch (err) {
        setError("No se pudo cargar el perfil");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  return { data, loading, error };
}