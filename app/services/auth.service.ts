import {
  apiRequest,
  apiFormRequest,
  removeToken,
  saveToken,
} from "@/app/services/http.service";

export type UserRole = "listener" | "artist";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePhoto?: string;
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

type FlexibleBackendUserResponse = {
  userId?: string;
  id?: string;
  uuid?: string;
  userName?: string;
  username?: string;
  name?: string;
  email?: string;
  roleName?: string;
  role?: string;
  profilePhoto?: string | number[] | null;
};

export type BackendUserResponse = FlexibleBackendUserResponse;

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export type UpdateProfilePayload = {
  userId: string;
  userName: string;
  profilePhoto?: File | null;
};

const MUSIC_API_URL =
  process.env.NEXT_PUBLIC_MUSIC_API_URL || "http://flowymusic.tech:8082";

const LOCAL_SESSION_TOKEN = "flowy-session";

function readString(
  item: Record<string, unknown>,
  keys: string[],
  fallback = "",
) {
  for (const key of keys) {
    const value = item[key];

    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }

  return fallback;
}

function mapRole(roleName?: string): UserRole {
  const normalizedRole = roleName?.toLowerCase().trim();

  if (
    normalizedRole === "artista" ||
    normalizedRole === "artist" ||
    normalizedRole === "rol_artista"
  ) {
    return "artist";
  }

  return "listener";
}

function bytesToBase64(bytes: number[]) {
  if (typeof window === "undefined") return "";

  let binary = "";
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.slice(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return window.btoa(binary);
}

function normalizeProfilePhoto(profilePhoto?: string | number[] | null) {
  if (!profilePhoto) return undefined;

  if (typeof profilePhoto === "string") {
    const cleanPhoto = profilePhoto.trim();

    if (!cleanPhoto) return undefined;
    if (cleanPhoto.startsWith("data:image")) return cleanPhoto;
    if (cleanPhoto.startsWith("http")) return cleanPhoto;

    return `data:image/jpeg;base64,${cleanPhoto}`;
  }

  if (Array.isArray(profilePhoto)) {
    const base64 = bytesToBase64(profilePhoto);
    return base64 ? `data:image/jpeg;base64,${base64}` : undefined;
  }

  return undefined;
}

function mapBackendUserToAuthUser(
  response: BackendUserResponse,
  fallbackEmail: string,
  fallbackName = "Usuario",
): AuthUser {
  const item = response as Record<string, unknown>;

  return {
    id: readString(item, ["userId", "id", "uuid"], ""),
    name: readString(item, ["userName", "username", "name"], fallbackName),
    email: readString(item, ["email"], fallbackEmail),
    role: mapRole(readString(item, ["roleName", "role"], "listener")),
    profilePhoto: normalizeProfilePhoto(response.profilePhoto),
  };
}

async function syncArtistNameIfNeeded(user: AuthUser) {
  if (user.role !== "artist") return;

  try {
    const response = await fetch(`${MUSIC_API_URL}/artists/update-name-by-user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        artistName: user.name,
      }),
    });

    if (!response.ok) {
      console.warn(
        `No se pudo sincronizar el nombre del artista: ${response.status}`,
      );
    }
  } catch (error) {
    console.warn("Error sincronizando nombre del artista:", error);
  }
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const response = await apiRequest<BackendUserResponse>("/user/login", {
      method: "POST",
      body: {
        email: payload.usernameOrEmail,
        password: payload.password,
      },
      auth: false,
    });

    const user = mapBackendUserToAuthUser(
      response,
      payload.usernameOrEmail,
      payload.usernameOrEmail,
    );

    saveToken(LOCAL_SESSION_TOKEN);
    saveAuthUser(user);

    return {
      token: LOCAL_SESSION_TOKEN,
      user,
    };
  } catch {
    throw new Error("Correo o contraseña incorrectos.");
  }
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await apiRequest<BackendUserResponse>("/user/register", {
    method: "POST",
    body: {
      name: payload.name,
      email: payload.email,
      password: payload.password,
    },
    auth: false,
  });

  const user = mapBackendUserToAuthUser(response, payload.email, payload.name);

  saveToken(LOCAL_SESSION_TOKEN);
  saveAuthUser(user);

  return {
    token: LOCAL_SESSION_TOKEN,
    user,
  };
}

export async function updateProfileRequest(
  payload: UpdateProfilePayload,
): Promise<AuthUser> {
  const formData = new FormData();

  formData.append("userId", payload.userId);
  formData.append("userName", payload.userName);

  if (payload.profilePhoto) {
    formData.append("profilePhoto", payload.profilePhoto);
  }

  const response = await apiFormRequest<BackendUserResponse>(
    "/user/update-profile",
    formData,
    {
      method: "PUT",
    },
  );

  const storedUser = getStoredAuthUser();

  const updatedUser = mapBackendUserToAuthUser(
    response,
    storedUser?.email ?? "",
    payload.userName,
  );

  saveToken(LOCAL_SESSION_TOKEN);
  saveAuthUser(updatedUser);

  await syncArtistNameIfNeeded(updatedUser);

  return updatedUser;
}

export async function getCurrentUserRequest() {
  const storedUser = getStoredAuthUser();

  if (!storedUser) {
    throw new Error("No hay usuario guardado");
  }

  return storedUser;
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
    const parsed = JSON.parse(raw) as Partial<AuthUser>;

    if (!parsed.id || !parsed.name) return null;

    return {
      id: parsed.id,
      name: parsed.name,
      email: parsed.email ?? "",
      role: parsed.role ?? "listener",
      profilePhoto: parsed.profilePhoto,
    };
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
