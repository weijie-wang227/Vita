const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";
const authTokenStorageKey = "vita.authToken";

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function getAuthToken() {
  if (!canUseStorage()) {
    return null;
  }

  return window.localStorage.getItem(authTokenStorageKey);
}

export function setAuthToken(token: string) {
  if (canUseStorage()) {
    window.localStorage.setItem(authTokenStorageKey, token);
  }
}

export function clearAuthToken() {
  if (canUseStorage()) {
    window.localStorage.removeItem(authTokenStorageKey);
  }
}

async function readErrorMessage(response: Response) {
  const fallback = `API request failed (${response.status} ${response.statusText})`;
  const text = await response.text();

  if (!text) {
    return fallback;
  }

  try {
    const data = JSON.parse(text) as { message?: string };
    return data.message || fallback;
  } catch {
    return text;
  }
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const url = new URL(path.replace(/^\//, ""), `${apiBaseUrl.replace(/\/$/, "")}/`);
  const headers = new Headers(init?.headers);
  const token = getAuthToken();

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...init,
    headers,
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return response.json() as Promise<T>;
}
