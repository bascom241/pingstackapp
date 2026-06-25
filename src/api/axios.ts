import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  clearAuthSession,
  saveAuthSession,
} from "../../utils/authToken";

const baseURL = "http://localhost:5000/api/v1";
export const axiosInstance = axios.create({
  baseURL,
});

const publicUrls = ["/auth/login", "/auth/register", "/auth/refresh"];
axiosInstance.interceptors.request.use(
  (config) => {
    const isPublic = publicUrls.some((url) => config.url?.includes(url));
    if (!isPublic) {
      const token = getAccessToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom: any) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config || {};
    const isPublicRoute = publicUrls.some((url) => {
      originalRequest.includes(url);
    });
    if (isPublicRoute) {
      return Promise.reject(error);
    }
    if (
      error.response &&
      (error.response.status === 401 ||
        error.response.status === 403 ||
        error.response.data.message === "jwt expired") &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = "Bearer " + token;
          return axiosInstance(originalRequest);
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          clearAuthSession();
          window.location.href = `/login?redirect=${encodeURIComponent(
            window.location.pathname + window.location.search,
          )}`;
          return Promise.reject(error);
        }

        const res = await axios.post(`${baseURL}/auth/refresh`, {
          refreshToken,
        });

        const newAccessToken = res.data.data.accessToken;
        const newRefreshToken = res.data.data.refreshToken;

        saveAuthSession({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });

        axiosInstance.defaults.headers.Authorization =
          "Bearer " + newAccessToken;

        processQueue(null, newAccessToken);

        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);

        clearAuthSession();

        window.location.href = `/login?redirect=${encodeURIComponent(
          window.location.pathname + window.location.search,
        )}`;

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
