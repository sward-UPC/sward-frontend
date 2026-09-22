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

/** Un error de validación de FastAPI (los 422 traen una lista de estos). */
type ErrorDeValidacion = { type?: string; msg?: string; loc?: (string | number)[] };

const ETIQUETAS: Record<string, string> = {
  correo: 'el correo',
  correo_institucional: 'el correo',
  password: 'la contraseña',
  new_password: 'la contraseña nueva',
  codigo: 'el código',
  nombre: 'el nombre',
  apellido: 'el apellido',
};

/**
 * Los 422 llegan con los mensajes de pydantic, en inglés y con jerga («String
 * should have at least 8 characters»). El participante ve la aplicación en
 * español, así que se traduce lo que puede llegarle a la pantalla; para el
 * resto, un aviso claro en vez del texto del servidor.
 */
function mensajeDeValidacion(detalle: ErrorDeValidacion[]): string {
  const primero = detalle[0];
  if (!primero) return 'Revisa los datos e inténtalo de nuevo.';
  const campo = String(primero.loc?.[primero.loc.length - 1] ?? '');
  const etiqueta = ETIQUETAS[campo] ?? 'los datos';
  const tipo = primero.type ?? '';

  if (tipo === 'missing') return `Falta ${etiqueta}.`;
  if (campo === 'correo' || campo === 'correo_institucional') {
    return 'Escribe un correo válido, como nombre@universidad.edu.pe.';
  }
  if (tipo === 'string_too_short') return `${capitalizar(etiqueta)} es demasiado corta.`;
  if (tipo === 'string_too_long') return `${capitalizar(etiqueta)} es demasiado larga.`;
  return 'Revisa los datos e inténtalo de nuevo.';
}

function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
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
          ? mensajeDeValidacion(detail as ErrorDeValidacion[])
          : error.message;

    return Promise.reject(new Error(message));
  },
);
