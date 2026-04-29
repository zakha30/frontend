import axios from 'axios';
import toast from 'react-hot-toast';

// ── Base URL ──────────────────────────────────────────────────────────────────
// Dev:  leave VITE_API_URL unset — Vite proxy forwards /api → https://localhost:7089
// Prod: set VITE_API_URL=https://api.yourdomain.com in your CI/CD environment
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}`
  : '/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  // withCredentials = true is REQUIRED for HttpOnly cookies to be sent
  // on cross-origin requests. The browser will not attach cookies otherwise.
  withCredentials: true,
});

// ── Request interceptor ───────────────────────────────────────────────────────
// No Authorization header injection needed — the browser sends the HttpOnly
// access token cookie automatically on every request to the same origin.
// Nothing to do here except leave it as a hook for future customisation.
apiClient.interceptors.request.use((config) => config);

// ── Response interceptor ──────────────────────────────────────────────────────
let isRefreshing = false;
let refreshSubscribers: Array<(success: boolean) => void> = [];

const onRefreshComplete = (success: boolean) => {
  refreshSubscribers.forEach(cb => cb(success));
  refreshSubscribers = [];
};

apiClient.interceptors.response.use(
  (res) => res,

  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config;

    // ── 401: access token expired ──────────────────────────────────────────
    // Try a silent token refresh using the refresh token cookie.
    // If refresh succeeds, replay the original request transparently.
    if (status === 401 && !originalRequest._retried) {
      originalRequest._retried = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          // POST /api/auth/refresh — backend reads refresh cookie, sets new cookies.
          await apiClient.post('/auth/refresh');
          isRefreshing = false;
          onRefreshComplete(true);
          // Replay the original failed request (now with fresh access cookie).
          return apiClient(originalRequest);
        } catch {
          // Refresh failed — session is dead. Clear UI state and go to login.
          isRefreshing = false;
          onRefreshComplete(false);
          // Import lazily to avoid circular dependency
          const { useAuthStore } = await import('../store/authStore');
          useAuthStore.getState().clearAuth();
          if (!window.location.pathname.startsWith('/login')) {
            window.location.href = '/login';
          }
          return Promise.reject(error);
        }
      }

      // Another request already triggered the refresh — queue this one.
      return new Promise((resolve, reject) => {
        refreshSubscribers.push((success) => {
          if (success) resolve(apiClient(originalRequest));
          else reject(error);
        });
      });
    }

    // ── 429: rate limited ──────────────────────────────────────────────────
    if (status === 429) {
      toast.error('Too many requests — please wait a moment and try again.');
      return Promise.reject(error);
    }

    // ── All other errors: extract and show a toast ─────────────────────────
    const data = error.response?.data;
    const msg =
      (typeof data === 'string' && data.length < 300 && data) ||
      data?.error ||
      data?.message ||
      data?.title ||
      'An unexpected error occurred.';

    if (status !== 401) {
      toast.error(typeof msg === 'string' ? msg : 'Request failed.');
    }

    return Promise.reject(error);
  }
);
