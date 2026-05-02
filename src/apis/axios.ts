import axios from "axios";
import {
  clearAuthTokens,
  extractAccessToken,
  extractRefreshToken,
} from "./auth/auth";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

let refreshPromise: Promise<string | null> | null = null;

const refreshTokens = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    return null;
  }

  const baseURL = import.meta.env.VITE_API_URL ?? "/api";
  const response = await fetch(`${baseURL}/auth/refresh`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("토큰 재발급에 실패했습니다.");
  }

  const data = (await response.json()) as Record<string, unknown>;
  const nextAccessToken = extractAccessToken(data);
  const nextRefreshToken = extractRefreshToken(data);

  if (nextAccessToken) {
    localStorage.setItem("accessToken", nextAccessToken);
  }

  if (nextRefreshToken) {
    localStorage.setItem("refreshToken", nextRefreshToken);
  }

  return nextAccessToken;
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as typeof error.config & {
      _retry?: boolean;
    };

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshPromise ??= refreshTokens().finally(() => {
        refreshPromise = null;
      });

      const nextAccessToken = await refreshPromise;

      if (!nextAccessToken) {
        clearAuthTokens();
        return Promise.reject(error);
      }

      originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      clearAuthTokens();
      return Promise.reject(refreshError);
    }
  },
);
