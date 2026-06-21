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
}

/** Provee contexto de autenticación JWT para toda la aplicación. */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('sward_user');
    return stored ? (JSON.parse(stored) as User) : null;
  });

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
