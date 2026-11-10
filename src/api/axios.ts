import axios, { type InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "./config";
import { getAccessToken, getRefreshToken, getSessionRevision, isAccessTokenExpired, clearAuthSession, saveAuthSession } from "../../utils/authToken";

export const axiosInstance = axios.create({ baseURL: API_BASE_URL });
const sessionClient = axios.create({ baseURL: API_BASE_URL, timeout: 15000 });
const publicUrls = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/logout", "/auth/forgot-password", "/auth/reset-password"];
const isPublicUrl = (url?: string) => publicUrls.some(route => (url ?? "").split(/[?#]/)[0].replace(/\/+$/, "").endsWith(route));
type SessionRequest = InternalAxiosRequestConfig & { _retry?: boolean; _authRevision?: number };

axiosInstance.interceptors.request.use((config: SessionRequest) => {
  if (!isPublicUrl(config.url)) {
    if (config._authRevision !== undefined && config._authRevision !== getSessionRevision()) throw new axios.CanceledError("Session changed");
    config._authRevision = getSessionRevision();
    const token = getAccessToken();
    if (token) config.headers.set("Authorization", `Bearer ${token}`);
    else config.headers.delete("Authorization");
  } else config.headers.delete("Authorization");
  return config;
});

let refreshPromise: Promise<string> | null = null;
function expireSession() {
  clearAuthSession();
  window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
}

async function refreshAccessToken(): Promise<string> {
  const revision = getSessionRevision();
  const token = getRefreshToken();
  try {
    if (!token) throw new Error("No refresh token available");
    const res = await sessionClient.post("/auth/refresh", { token });
    const session = res.data?.data ?? res.data;
    if (typeof session?.accessToken !== "string" || !session.accessToken) throw new Error("Invalid refresh response");
    if (revision !== getSessionRevision() || getRefreshToken() !== token) {
      // A logout or a new login must not be undone by a late refresh response.
      await sessionClient.post("/auth/logout", { token: session.refreshToken }, { headers: { Authorization: `Bearer ${session.accessToken}` } }).catch(() => {});
      throw new axios.CanceledError("Session changed during refresh");
    }
    saveAuthSession({ accessToken: session.accessToken, refreshToken: session.refreshToken || token }, { refresh: true });
    return session.accessToken;
  } catch (error) {
    if (revision !== getSessionRevision()) throw error;
    // Another browser tab may already have rotated this token.
    const current = getAccessToken();
    if (token && getRefreshToken() !== token && current && !isAccessTokenExpired(current)) return current;
    const rejected = axios.isAxiosError(error) && [401, 403].includes(error.response?.status ?? 0);
    if (!token || rejected || (error instanceof Error && error.message === "Invalid refresh response")) expireSession();
    throw error;
  }
}

export function refreshSession(): Promise<string> {
  if (!refreshPromise) {
    const perform = () => refreshAccessToken();
    const previousToken = getRefreshToken();
    const run = typeof navigator !== "undefined" && navigator.locks
      ? navigator.locks.request("pingstack-session-refresh", () => {
          const current = getAccessToken();
          if (getRefreshToken() !== previousToken && current && !isAccessTokenExpired(current)) return Promise.resolve(current);
          return perform();
        })
      : perform();
    refreshPromise = run.finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}

export async function logoutSession(): Promise<void> {
  const token = getRefreshToken();
  const access = getAccessToken();
  clearAuthSession();
  await sessionClient.post("/auth/logout", { token }, { headers: access ? { Authorization: `Bearer ${access}` } : {} });
}

axiosInstance.interceptors.response.use(response => response, async (error: unknown) => {
  if (!axios.isAxiosError(error)) throw error;
  const request = error.config as SessionRequest | undefined;
  const expired = error.response?.status === 401 || error.response?.data?.message === "jwt expired";
  if (!request || isPublicUrl(request.url) || !expired) throw error;
  if (request._authRevision !== getSessionRevision()) throw new axios.CanceledError("Session changed");
  if (request._retry) { expireSession(); throw error; }
  request._retry = true;
  const current = getAccessToken();
  if (!current || request.headers.get("Authorization") === `Bearer ${current}`) await refreshSession();
  if (request._authRevision !== getSessionRevision()) throw new axios.CanceledError("Session changed");
  return axiosInstance(request);
});
