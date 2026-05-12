import {
  apiRequest,
  removeToken,
  saveToken,
} from "@/app/services/http.service";

export type UserRole = "listener" | "artist";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type LoginPayload = {
  usernameOrEmail: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  name: string;
  birthDate: string;
  gender: string;
  acceptedTerms: boolean;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export async function login(payload: LoginPayload) {
  const response = await apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: payload,
    auth: false,
  });

  saveToken(response.token);
  saveAuthUser(response.user);

  return response;
}

export async function register(payload: RegisterPayload) {
  const response = await apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: payload,
    auth: false,
  });

  saveToken(response.token);
  saveAuthUser(response.user);

  return response;
}

export async function getCurrentUserRequest() {
  return apiRequest<AuthUser>("/users/me");
}

export function saveAuthUser(user: AuthUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem("flowy_user", JSON.stringify(user));
}

export function getStoredAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("flowy_user");

  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("flowy_user");
  }

  removeToken();
}