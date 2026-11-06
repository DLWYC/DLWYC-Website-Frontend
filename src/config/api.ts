
// import axios from "axios"
// import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
// import { config } from "../config/index";

// // Extend Axios configuration type safely using TypeScript declaration merging
// interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
//   _retry?: boolean;
// }

// // 1. Isolate the base structural configuration
// const axiosBaseConfig: AxiosRequestConfig = {
//   baseURL: config.baseURL,
//   withCredentials: true,
// };

// // 2. Instantiate clean architectural instances
// export const api: AxiosInstance = axios.create(axiosBaseConfig);

// // Isolated instance explicitly configured to bypass standard response interceptors
// const refreshApi: AxiosInstance = axios.create(axiosBaseConfig);

// /**
//  * Creates a scoped interceptor context to ensure thread-safety,
//  * isolating queue states from the global execution environment (SSR Safe).
//  */
// const setupResponseInterceptors = (mainInstance: AxiosInstance, fallbackInstance: AxiosInstance) => {
//   let isRefreshing = false;
//   let failedQueue: Array<{ resolve: (value?: any) => void; reject: (reason?: any) => void }> = [];

//   const processQueue = (error: any = null) => {
//     failedQueue.forEach((promise) => {
//       if (error) {
//         promise.reject(error);
//       } else {
//         promise.resolve();
//       }
//     });
//     failedQueue = [];
//   };

//   mainInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config as CustomAxiosRequestConfig;
    
//     // 1. Capture the backend's explicit error envelope
//     const serverResponse = error.response?.data;
//     const statusCode = error.response?.status;
    
//     // Fallback gracefully if backend provides string message vs error code
//     const errorCode = serverResponse?.code; // e.g., "AUTH_TOKEN_EXPIRED"
//     const errorMessage = serverResponse?.message || ""; // e.g., "jwt expired"

//     // 2. Strict Conditional Routing: Only refresh on explicit expiration signals
//     const isTokenExpired = 
//       statusCode === 401 && 
//       (errorCode === "AUTH_TOKEN_EXPIRED" || errorMessage.toLowerCase().includes("expired"));

//     if (isTokenExpired && originalRequest && !originalRequest._retry) {
      
//       if (originalRequest.url?.includes("/auth/refresh-token") || originalRequest.url?.includes("/auth/logout")) {
//         handleLogout();
//         return Promise.reject(error);
//       }

//       originalRequest._retry = true;

//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then(() => mainInstance(originalRequest))
//           .catch((err) => Promise.reject(err));
//       }

//       isRefreshing = true;

//       try {
//         await fallbackInstance.post("/auth/refresh-token");
//         isRefreshing = false;
//         processQueue(null);
//         return mainInstance(originalRequest);
//       } catch (refreshError) {
//         isRefreshing = false;
//         processQueue(refreshError);
//         handleLogout();
//         return Promise.reject(refreshError);
//       }
//     }

//     // If it's a 401 but NOT due to an expired token (e.g., bad credentials on /login)
//     // pass it straight through to the component UI to handle
//     return Promise.reject(error);
//   }
// );

// };

// // Initialize interceptor wrapper passing core dependencies
// setupResponseInterceptors(api, refreshApi);

// /**
//  * Gracefully evicts authenticated session parameters and clears client UI context
//  */
// export const handleLogout = async (): Promise<void> => {
//   try {
//     // Invoke backend to explicitly clear httpOnly cookies
//     await refreshApi.post("/auth/logout");
//   } catch (error) {
//     // Log telemetry internally; do not block user navigation layout updates
//     console.error("[Auth System] Structural logout routine cookie clearing failed:", error);
//   } finally {
//     // Production Safe: Clear application state first. Use client router in SPA if available.
//     // If using Next.js/React Router, inject router.push('/login') here to avoid hard flashing.
//     if (typeof window !== "undefined") {
//       // Prevents cyclic refresh loops if we are already sitting on the public root
//       if (window.location.pathname !== "/login") {
//         window.location.href = "/login";
//       }
//     }
//   }
// };





import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { config } from "../config/index";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const axiosBaseConfig: AxiosRequestConfig = {
  baseURL: config.baseURL,
  withCredentials: true, // ✅ Keeps Cookie authentication functional for all requests
};

export const api: AxiosInstance = axios.create(axiosBaseConfig);
const refreshApi: AxiosInstance = axios.create(axiosBaseConfig);

// In-memory variable for Header-based Authentication (e.g., api.get('user/profile'))
let runtimeAccessToken: string | null = null;

/**
 * Commits the access token to memory and sets defaults for subsequent requests.
 */
export const setAccessToken = (token: string | null) => {
  runtimeAccessToken = token;
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// 1. Request Interceptor: Synchronously appends the token header IF it exists in memory
api.interceptors.request.use((reqConfig) => {
  if (runtimeAccessToken && reqConfig.headers) {
    reqConfig.headers["Authorization"] = `Bearer ${runtimeAccessToken}`;
  }
  return reqConfig;
});

const setupResponseInterceptors = (mainInstance: AxiosInstance, fallbackInstance: AxiosInstance) => {
  let isRefreshing = false;
  
  // The queue accepts either a raw token string or null (if the backend is relying purely on cookies)
  let failedQueue: Array<{ 
    resolve: (token: string | null) => void; 
    reject: (reason?: any) => void; 
  }> = [];

  const processQueue = (error: any = null, token: string | null = null) => {
    failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve(token);
      }
    });
    failedQueue = [];
  };

  mainInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config as CustomAxiosRequestConfig;
      const serverResponse = error.response?.data;
      const statusCode = error.response?.status;
      const errorCode = serverResponse?.code;
      const errorMessage = serverResponse?.message || "";

      const isTokenExpired = 
        statusCode === 401 && 
        (errorCode === "AUTH_TOKEN_EXPIRED" || errorMessage.toLowerCase().includes("expired"));

      if (isTokenExpired && originalRequest && !originalRequest._retry) {
        if (originalRequest.url?.includes("/auth/refresh-token") || originalRequest.url?.includes("/auth/logout")) {
          handleLogout();
          return Promise.reject(error);
        }

        originalRequest._retry = true;

        // Handle concurrent requests trying to run while a refresh is in progress
        if (isRefreshing) {
          return new Promise<string | null>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((newToken) => {
              if (originalRequest.headers) {
                if (newToken) {
                  // Core Header Upgrade: Inject fresh token string over the stale one
                  originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                } else if (!runtimeAccessToken) {
                  // Safety: If no header token exists, clean up stale text references
                  delete originalRequest.headers["Authorization"];
                }
              }
              return mainInstance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        isRefreshing = true;

        try {
          // Fire the refresh API request. 
          // Due to withCredentials: true, the refresh cookie is automatically transmitted.
          const response = await fallbackInstance.post("/auth/refresh-token");
          
          // Hybrid Payload Check: Attempt to extract a token if the backend provides one
          const newAccessToken = response.data?.token || response.data?.accessToken || null; 

          if (newAccessToken) {
            // Commit header token back to runtime system
            setAccessToken(newAccessToken);
            if (originalRequest.headers) {
              originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            }
          } else {
            // Cookie-only fallback: Clear stale strings from the retrying request headers
            if (originalRequest.headers) {
              delete originalRequest.headers["Authorization"];
            }
          }
          
          // Release all queued concurrent network calls
          processQueue(null, newAccessToken);
          isRefreshing = false;

          return mainInstance(originalRequest);

        } catch (refreshError) {
          isRefreshing = false;
          processQueue(refreshError, null);
          handleLogout();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

setupResponseInterceptors(api, refreshApi);

export const handleLogout = async (): Promise<void> => {
  try {
    await refreshApi.post("/auth/logout");
  } catch (error) {
    console.error("[Auth System] Structural logout routine cookie clearing failed:", error);
  } finally {
    setAccessToken(null); // Completely wipe structural memory footprint
    if (typeof window !== "undefined" && window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }
};
