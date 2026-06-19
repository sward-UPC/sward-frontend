import { useNavigate } from 'react-router';
import { useAuth } from './useAuth';

/** Limpia la sesión y redirige a /login. */
export function useLogout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return async () => {
    await logout();
    navigate('/login', { replace: true });
  };
}
