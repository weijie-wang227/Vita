const apiBaseUrl = import.meta.env.VITE_API_URL ?? "";

export async function apiRequest<T>(
  path: string,
  _init?: RequestInit,
): Promise<T> {
  void path;
  void _init;
  void apiBaseUrl;

  throw new Error("TODO: wire the mobile mockup API client to backend endpoints.");
}
