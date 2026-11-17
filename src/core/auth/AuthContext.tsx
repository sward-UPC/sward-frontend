import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, UserRole, LoginResponse } from '@core/types';
import { logout as revokeSession, me } from '@features/auth/services/auth.service';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  /** Persiste tokens y carga el perfil del usuario tras login exitoso. */
  login: (response: LoginResponse) => Promise<void>;
  /** Revoca el token en el servidor y limpia la sesión local. */
  logout: () => Promise<void>;
  /** Actualiza campos del usuario en sesión (p. ej. avatar tras editar perfil). */
  updateUser: (patch: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
  /**
   * Qué hacer cuando otra ventana del mismo navegador cambia de persona o cierra
   * la sesión. Por defecto recarga, para que esta ventana deje de mostrar datos
   * de una sesión que ya no es la suya. Se puede reemplazar en las pruebas.
   */
  alCambiarSesionEnOtraVentana?: () => void;
}

const recargarPagina = () => window.location.reload();

function idDeUsuarioGuardado(valor: string | null): string | null {
  if (!valor) return null;
  try {
    return (JSON.parse(valor) as Partial<User>).id ?? null;
  } catch {
    return null;
  }
}

/** Provee contexto de autenticación JWT para toda la aplicación. */
export function AuthProvider({
  children,
  alCambiarSesionEnOtraVentana = recargarPagina,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('sward_user');
    return stored ? (JSON.parse(stored) as User) : null;
  });

  // La sesión vive en localStorage, que comparten todas las ventanas y pestañas
  // del mismo navegador. Si en otra entra otra persona o se cierra la sesión,
  // esta ventana seguiría con el nombre anterior mientras pide los datos con la
  // sesión nueva (CP011, ciclo 1). El evento `storage` solo llega a las OTRAS
  // ventanas, así que los cambios hechos aquí no lo disparan.
  const idActual = user?.id ?? null;
  useEffect(() => {
    const alCambiar = (e: StorageEvent) => {
      if (e.key !== 'sward_user' && e.key !== null) return; // null = se vació todo
      const idNuevo = e.key === null ? null : idDeUsuarioGuardado(e.newValue);
      if (idNuevo !== idActual) alCambiarSesionEnOtraVentana();
    };
    window.addEventListener('storage', alCambiar);
    return () => window.removeEventListener('storage', alCambiar);
  }, [idActual, alCambiarSesionEnOtraVentana]);

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('sward_access_token')
  );

  useEffect(() => {
    if (user) {
      localStorage.setItem('sward_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sward_user');
    }
  }, [user]);

  const login = useCallback(async (response: LoginResponse) => {
    localStorage.setItem('sward_access_token', response.access_token);
    localStorage.setItem('sward_refresh_token', response.refresh_token);
    setToken(response.access_token);
    try {
      const profile = await me();
      setUser(profile);
    } catch {
      // Si falla la carga del perfil, seguimos autenticados con token pero sin perfil
    }
  }, []);

  const updateUser = useCallback((patch: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const logout = useCallback(async () => {
    // Revoca el token en el servidor (blacklist en Redis). Best-effort: aunque
    // falle (p. ej. token ya vencido), igual limpiamos la sesión local.
    try {
      await revokeSession();
    } catch {
      // ignorado a propósito
    }
    localStorage.removeItem('sward_access_token');
    localStorage.removeItem('sward_refresh_token');
    localStorage.removeItem('sward_user');
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      role: user?.role ?? null,
      login,
      logout,
      updateUser,
    }),
    [user, token, login, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
