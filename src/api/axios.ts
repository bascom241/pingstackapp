import axios, { type InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "./config";
import { getAccessToken, getRefreshToken, clearAuthSession, saveAuthSession } from "../../utils/authToken";

export const axiosInstance = axios.create({ baseURL: API_BASE_URL });
// Refresh requests bypass the authenticated response interceptor.
const refreshClient = axios.create({ baseURL: API_BASE_URL });
const publicUrls = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/forgot-password", "/auth/reset-password"];
const isPublicUrl = (url?: string) => {
  const path = (url ?? "").split(/[?#]/)[0].replace(/\/+$/, "");
  return publicUrls.some((route) => path.endsWith(route));
};

axiosInstance.interceptors.request.use((config) => {
  if (!isPublicUrl(config.url)) {
    const token = getAccessToken();
    if (token) config.headers.set("Authorization", `Bearer ${token}`);
    else config.headers.delete("Authorization");
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;
function expireSession() {
  clearAuthSession();
  window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
}

async function refreshAccessToken(): Promise<string> {
  try {
    const token = getRefreshToken();
    if (!token) throw new Error("No refresh token available");
    const res = await refreshClient.post("/auth/refresh", { token });
    const session = res.data?.data;
    if (typeof session?.accessToken !== "string" || !session.accessToken) throw new Error("Invalid refresh response");
    saveAuthSession({ accessToken: session.accessToken, refreshToken: session.refreshToken || token });
    return session.accessToken;
  } catch (error) {
    expireSession();
    throw error;
  }
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) throw error;
    const request = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const expired = error.response?.status === 401 || error.response?.data?.message === "jwt expired";
    // Ordinary permission-denied responses must not refresh or log the user out.
    if (!request || isPublicUrl(request.url) || !expired) throw error;
    if (request._retry) { expireSession(); throw error; }
    request._retry = true;
    const currentToken = getAccessToken();
    // Late responses may have used a token already replaced by another refresh.
    if (!currentToken || request.headers.get("Authorization") === `Bearer ${currentToken}`) {
      if (!refreshPromise) refreshPromise = refreshAccessToken().finally(() => { refreshPromise = null; });
      await refreshPromise;
    }
    return axiosInstance(request);
  },
);
