const API_URL = process.env.NEXT_PUBLIC_API_URL;

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  headers?: HeadersInit;
  auth?: boolean;
};

export function getApiUrl() {
  return API_URL;
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("flowy_token");
}

export function saveToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("flowy_token", token);
}

export function removeToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("flowy_token");
}

export function isLoggedIn() {
  return Boolean(getToken());
}

function buildUrl(path: string) {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL no está configurado.");
  }

  return `${API_URL}${path}`;
}

async function getErrorMessage(res: Response) {
  let message = "Ocurrió un error con el servidor.";

  try {
    const errorBody = await res.json();
    message = errorBody.message ?? errorBody.error ?? message;
  } catch {
    // El backend puede responder vacío o con texto no JSON.
  }

  return message;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  if (options.auth !== false && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(buildUrl(path), {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(await getErrorMessage(res));
  }

  if (res.status === 204) {
    return null as T;
  }

  return res.json() as Promise<T>;
}

export async function apiFormRequest<T>(
  path: string,
  formData: FormData,
  options: Omit<RequestOptions, "body" | "headers"> = {},
): Promise<T> {
  const token = getToken();
  const headers = new Headers();

  if (options.auth !== false && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(buildUrl(path), {
    method: options.method ?? "POST",
    headers,
    body: formData,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(await getErrorMessage(res));
  }

  if (res.status === 204) {
    return null as T;
  }

  return res.json() as Promise<T>;
}