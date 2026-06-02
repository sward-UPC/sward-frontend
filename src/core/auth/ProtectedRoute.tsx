import { Navigate, Outlet } from 'react-router';
import { useAuth } from './useAuth';
import type { UserRole } from '@core/types';

interface ProtectedRouteProps {
  /** Roles permitidos. Si está vacío, solo requiere autenticación. */
  allowedRoles?: UserRole[];
}

/**
 * Guard de ruta: redirige a /login si no hay sesión activa.
 * Si se especifican `allowedRoles`, también verifica el rol del usuario.
 */
export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && role && !allowedRoles.includes(role)) {
    // Usuario autenticado pero sin el rol requerido → redirige a su dashboard
    const roleRedirects: Record<string, string> = {
      student: '/student',
      teacher: '/teacher',
      admin: '/admin',
    };
    return <Navigate to={roleRedirects[role] ?? '/login'} replace />;
  }

  return <Outlet />;
}
