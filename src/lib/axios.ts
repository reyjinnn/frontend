import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

// Create base instance
const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// A flag to prevent multiple refresh token requests concurrently
let isRefreshing = false;
// Queue to hold failed requests while refreshing
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().accessToken;
    
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    // Inject Idempotency-Key for mutating requests
    const method = config.method?.toUpperCase();
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      if (!config.headers['Idempotency-Key']) {
        // Fallback for crypto.randomUUID in some older environments if needed
        config.headers['Idempotency-Key'] = typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : 'idempotency-' + new Date().getTime() + Math.random().toString(36).substring(2);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        // If currently refreshing, add to queue and wait
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = useAuthStore.getState().refreshToken;

      if (!refreshToken) {
        // No refresh token, can't refresh
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      try {
        // Trigger silent refresh
        const { data } = await axios.post<{ accessToken: string; refreshToken: string }>(
          'http://localhost:8080/api/v1/auth/refresh',
          { refreshToken }
        );

        const newAccessToken = data.accessToken;
        const newRefreshToken = data.refreshToken;

        // Save new tokens
        useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);

        // Process queued requests
        processQueue(null, newAccessToken);
        
        // Retry original request
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        // Refresh failed, logout
        processQueue(err, null);
        useAuthStore.getState().logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
