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

// Normaliza errores: extrae detail del backend y redirige en 401 (excepto en login/register).
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url ?? '';
    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register');

    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('sward_access_token');
      localStorage.removeItem('sward_refresh_token');
      localStorage.removeItem('sward_user');
      window.location.href = `${import.meta.env.BASE_URL}login`;
    }

    const detail = error.response?.data?.detail;
    const message = typeof detail === 'string'
      ? detail
      : Array.isArray(detail)
        ? detail.map((d: { msg?: string }) => d.msg ?? d).join(', ')
        : error.message;

    return Promise.reject(new Error(message));
  }
);
