import axios from "axios";

import axiosInstance, { API_URL } from "./api";

const authApi = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

// Request interceptor: Tokenni qo'shish
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Tokenni yangilash
authApi.interceptors.response.use(
  (config) => config,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._isRetry
    ) {
      originalRequest._isRetry = true;

      try {
        const res = await axiosInstance.get("/auth/refresh");

        if (res.data.accessToken) {
          localStorage.setItem("accessToken", res.data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return await authApi.request(originalRequest);
        }
      } catch (refreshError: any) {
        console.log("Refresh token failed:", refreshError);
        localStorage.removeItem("accessToken");
        // Redirect to login page
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default authApi;
