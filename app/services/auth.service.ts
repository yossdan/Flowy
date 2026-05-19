import { apiRequest, removeToken } from "@/app/services/http.service";

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

export type BackendUserResponse = {
  userId: string;
  userName: string;
  roleName: string;
  profilePhoto?: string | number[] | null;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

function mapRole(roleName: string): UserRole {
  const normalizedRole = roleName?.toLowerCase();

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
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return window.btoa(binary);
}

function normalizeProfilePhoto(profilePhoto?: string | number[] | null) {
  if (!profilePhoto) return undefined;

  if (typeof profilePhoto === "string") {
    if (profilePhoto.startsWith("data:image")) {
      return profilePhoto;
    }

    return `data:image/jpeg;base64,${profilePhoto}`;
  }

  if (Array.isArray(profilePhoto)) {
    return `data:image/jpeg;base64,${bytesToBase64(profilePhoto)}`;
  }

  return undefined;
}

function mapBackendUserToAuthUser(
  response: BackendUserResponse,
  email: string,
): AuthUser {
  return {
    id: response.userId,
    name: response.userName,
    email,
    role: mapRole(response.roleName),
    profilePhoto: normalizeProfilePhoto(response.profilePhoto),
  };
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

    const user = mapBackendUserToAuthUser(response, payload.usernameOrEmail);

    saveAuthUser(user);

    return {
      token: "flowy-session",
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

  const user = mapBackendUserToAuthUser(response, payload.email);

  saveAuthUser(user);

  return {
    token: "flowy-session",
    user,
  };
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