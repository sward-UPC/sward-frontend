import { useContext } from 'react';
import { AuthContext } from './AuthContext';

/** Retorna el contexto de autenticación con type safety. Lanza si se usa fuera de AuthProvider. */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return context;
}
