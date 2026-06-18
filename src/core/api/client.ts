import axios, { type AxiosRequestConfig } from 'axios';
import { ENDPOINTS } from './endpoints';

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

/** Borra la sesión local y manda al login (refresh agotado o inválido). */
function clearSessionAndRedirect() {
  localStorage.removeItem('sward_access_token');
  localStorage.removeItem('sward_refresh_token');
  localStorage.removeItem('sward_user');
  window.location.href = `${import.meta.env.BASE_URL}login`;
}

// Refresco single-flight: si varias requests fallan con 401 a la vez, solo se
// dispara UN POST /auth/refresh y todas esperan el mismo resultado.
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem('sward_refresh_token');
  if (!refreshToken) throw new Error('Sin refresh token');
  // axios "pelado" (sin los interceptores de apiClient) para evitar recursión.
  const { data } = await axios.post<{ access_token: string }>(
    `${BASE_URL}${ENDPOINTS.auth.refresh}`,
    { refresh_token: refreshToken },
    { headers: { 'Content-Type': 'application/json' } },
  );
  localStorage.setItem('sward_access_token', data.access_token);
  return data.access_token;
}

// Normaliza errores y, ante un 401, intenta refrescar el access token y
// reintentar la request original una vez antes de cerrar sesión.
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = (error.config ?? {}) as AxiosRequestConfig & { _retry?: boolean };
    const url: string = original.url ?? '';
    const isAuthEndpoint =
      url.includes('/auth/login') ||
      url.includes('/auth/register') ||
      url.includes('/auth/refresh');

    if (error.response?.status === 401 && !isAuthEndpoint && !original._retry) {
      original._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
          });
        }
        const newToken = await refreshPromise;
        original.headers = { ...(original.headers ?? {}), Authorization: `Bearer ${newToken}` };
        return apiClient(original);
      } catch {
        clearSessionAndRedirect();
      }
    }

    const detail = error.response?.data?.detail;
    const message =
      typeof detail === 'string'
        ? detail
        : Array.isArray(detail)
          ? detail.map((d: { msg?: string }) => d.msg ?? d).join(', ')
          : error.message;

    return Promise.reject(new Error(message));
  },
);
