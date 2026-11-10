// Empty means same-origin. VITE_API_URL may include an API path prefix.
export const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "").trim().replace(/\/+$/, "");

export function apiUrl(path: string): string {
  const base = new URL(API_BASE_URL || "/", window.location.origin).href.replace(/\/+$/, "");
  return `${base}/${path.replace(/^\/+/, "")}`;
}
