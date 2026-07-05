import axios from "axios";
import { config } from "../config/index";

export const api = axios.create({
  baseURL: config.baseURL,
  withCredentials: true,
});

const refreshApi = axios.create({
  baseURL: config.baseURL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes("/refresh-token")) {
        handleLogout();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        // Trigger backend to drop a new accessToken cookie
        await refreshApi.post("/auth/refresh-token");
        isRefreshing = false;
        processQueue(null);

        // Re-run the initial failed request with the new cookie automatically attached
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError);
        handleLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

const handleLogout = () => {
  // Clear any non-sensitive user profile UI data if necessary
  localStorage.removeItem("user");
};
