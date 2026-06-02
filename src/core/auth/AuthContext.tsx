import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, UserRole, LoginResponse } from '@core/types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  /** Persiste tokens y usuario tras login exitoso. */
  login: (response: LoginResponse) => void;
  /** Limpia sesión de localStorage y estado. */
  logout: () => void;
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

  const login = useCallback((response: LoginResponse) => {
    localStorage.setItem('sward_access_token', response.access);
    localStorage.setItem('sward_refresh_token', response.refresh);
    setToken(response.access);
    setUser(response.user);
  }, []);

  const logout = useCallback(() => {
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
      isAuthenticated: !!token && !!user,
      role: user?.role ?? null,
      login,
      logout,
    }),
    [user, token, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
