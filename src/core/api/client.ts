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

// En 401, limpia sesión y redirige al login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sward_access_token');
      localStorage.removeItem('sward_refresh_token');
      localStorage.removeItem('sward_user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);
