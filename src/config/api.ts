
import axios from "axios"
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { config } from "../config/index";

// Extend Axios configuration type safely using TypeScript declaration merging
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// 1. Isolate the base structural configuration
const axiosBaseConfig: AxiosRequestConfig = {
  baseURL: config.baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};

// 2. Instantiate clean architectural instances
export const api: AxiosInstance = axios.create(axiosBaseConfig);

// Isolated instance explicitly configured to bypass standard response interceptors
const refreshApi: AxiosInstance = axios.create(axiosBaseConfig);

/**
 * Creates a scoped interceptor context to ensure thread-safety,
 * isolating queue states from the global execution environment (SSR Safe).
 */
const setupResponseInterceptors = (mainInstance: AxiosInstance, fallbackInstance: AxiosInstance) => {
  let isRefreshing = false;
  let failedQueue: Array<{ resolve: (value?: any) => void; reject: (reason?: any) => void }> = [];

  const processQueue = (error: any = null) => {
    failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve();
      }
    });
    failedQueue = [];
  };

  mainInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    
    // 1. Capture the backend's explicit error envelope
    const serverResponse = error.response?.data;
    const statusCode = error.response?.status;
    
    // Fallback gracefully if backend provides string message vs error code
    const errorCode = serverResponse?.code; // e.g., "AUTH_TOKEN_EXPIRED"
    const errorMessage = serverResponse?.message || ""; // e.g., "jwt expired"

    // 2. Strict Conditional Routing: Only refresh on explicit expiration signals
    const isTokenExpired = 
      statusCode === 401 && 
      (errorCode === "AUTH_TOKEN_EXPIRED" || errorMessage.toLowerCase().includes("expired"));

    if (isTokenExpired && originalRequest && !originalRequest._retry) {
      
      if (originalRequest.url?.includes("/auth/refresh-token") || originalRequest.url?.includes("/auth/logout")) {
        handleLogout();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => mainInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        await fallbackInstance.post("/auth/refresh-token");
        isRefreshing = false;
        processQueue(null);
        return mainInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError);
        handleLogout();
        return Promise.reject(refreshError);
      }
    }

    // If it's a 401 but NOT due to an expired token (e.g., bad credentials on /login)
    // pass it straight through to the component UI to handle
    return Promise.reject(error);
  }
);

};

// Initialize interceptor wrapper passing core dependencies
setupResponseInterceptors(api, refreshApi);

/**
 * Gracefully evicts authenticated session parameters and clears client UI context
 */
export const handleLogout = async (): Promise<void> => {
  try {
    // Invoke backend to explicitly clear httpOnly cookies
    await refreshApi.post("/auth/logout");
  } catch (error) {
    // Log telemetry internally; do not block user navigation layout updates
    console.error("[Auth System] Structural logout routine cookie clearing failed:", error);
  } finally {
    // Production Safe: Clear application state first. Use client router in SPA if available.
    // If using Next.js/React Router, inject router.push('/login') here to avoid hard flashing.
    if (typeof window !== "undefined") {
      // Prevents cyclic refresh loops if we are already sitting on the public root
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
  }
};



