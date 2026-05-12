import { profileMock } from "@/app/lib/profile.mock";
import { mapProfileResponse } from "@/app/lib/profile.adapter";
import { apiRequest, getApiUrl } from "@/app/services/http.service";
import type { ProfileData } from "@/app/types/profile";

export async function getProfileData(): Promise<ProfileData> {
  if (!getApiUrl()) {
    return profileMock;
  }

  try {
    const json = await apiRequest<unknown>("/profile");
    return mapProfileResponse(json);
  } catch (error) {
    console.warn("Backend no disponible, usando mock:", error);
    return profileMock;
  }
}