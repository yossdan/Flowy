import { dashboardMock } from "@/app/lib/dashboard.mock";
import { mapDashboardResponse } from "@/app/lib/dashboard.adapter";
import { apiRequest, getApiUrl } from "@/app/services/http.service";
import type { DashboardData } from "@/app/types/dashboard";

export async function getDashboardData(): Promise<DashboardData> {
  if (!getApiUrl()) {
    return dashboardMock;
  }

  try {
    const json = await apiRequest<unknown>("/dashboard");
    return mapDashboardResponse(json);
  } catch (error) {
    console.warn("Backend no disponible, usando mock:", error);
    return dashboardMock;
  }
}