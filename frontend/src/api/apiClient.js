import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// ── Request Interceptor: Inject JWT ──────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: Silent Token Refresh on 401 ────────────────────────
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => refreshSubscribers.push(cb);

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Do not intercept auth endpoints (login, refresh, logout)
    if (
      originalRequest?.url?.includes('/api/auth/login') ||
      originalRequest?.url?.includes('/api/auth/refresh') ||
      originalRequest?.url?.includes('/api/auth/logout')
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem('refreshToken');

      // No refresh token → force logout
      if (!refreshToken) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.dispatchEvent(new Event('auth:logout'));
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(`${BASE_URL}/api/auth/refresh`, {
          refreshToken,
        });

        const newAccessToken = data.data.accessToken;
        const newRefreshToken = data.data.refreshToken;

        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        apiClient.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        onRefreshed(newAccessToken);
        isRefreshing = false;

        return apiClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = [];
        localStorage.clear();
        window.dispatchEvent(new Event('auth:logout'));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
