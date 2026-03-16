const API_URL = (import.meta.env.VITE_API_URL as string) || "";

const AUTH_TOKEN_KEY = "rc_admin_token";

export function getApiUrl(): string {
  return API_URL.replace(/\/$/, "");
}

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

async function request<T>(
  path: string,
  options: RequestInit & { method?: string; body?: unknown } = {}
): Promise<T> {
  const { method = "GET", body, ...rest } = options;
  const url = `${getApiUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((rest.headers as Record<string, string>) || {}),
  };
  const token = getAuthToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, {
    ...rest,
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const err = await res.json() as { error?: string };
      if (err?.error) message = err.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: "POST", body }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: "PUT", body }),
  patch: <T>(path: string, body: unknown) => request<T>(path, { method: "PATCH", body }),
  delete: (path: string) => request<undefined>(path, { method: "DELETE" }),
};
