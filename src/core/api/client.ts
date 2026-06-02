import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

/** Instancia axios con baseURL del API Gateway y Bearer token automático. */
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adjunta el token JWT de localStorage en cada petición
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('sward_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intenta refresh token en 401; si falla, limpia sesión
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('sward_refresh_token');
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refresh: refreshToken });
        localStorage.setItem('sward_access_token', data.access);
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return apiClient(originalRequest);
      } catch {
        localStorage.removeItem('sward_access_token');
        localStorage.removeItem('sward_refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
