import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { AuthProvider } from './AuthContext';
import { useAuth } from './useAuth';
import { UserRole, type User } from '@core/types';

// Defecto 41 (CP011, grupo 10): con dos ventanas del mismo navegador, si en la
// segunda entra otra persona, la primera seguía con el nombre anterior pero pedía
// los datos con la sesión nueva.

const hans: User = {
  id: 'u-hans',
  email: 'hans@example.com',
  firstName: 'Hans',
  lastName: 'Prueba',
  role: UserRole.Student,
  institution: 'UPC',
  createdAt: '2026-11-07T00:00:00Z',
};
const estudiante1: User = { ...hans, id: 'u-est1', email: 'est1@example.com', firstName: 'Estudiante 1' };

function Nombre() {
  const { user } = useAuth();
  return <p>{user ? `Hola, ${user.firstName}` : 'Sin sesión'}</p>;
}

/** Lo que ve esta ventana cuando otra escribe en el almacenamiento compartido. */
function otraVentanaEscribe(clave: string, valor: string | null) {
  const anterior = localStorage.getItem(clave);
  if (valor === null) localStorage.removeItem(clave);
  else localStorage.setItem(clave, valor);
  window.dispatchEvent(new StorageEvent('storage', { key: clave, oldValue: anterior, newValue: valor }));
}

describe('AuthProvider con varias ventanas', () => {
  beforeEach(() => {
    localStorage.setItem('sward_user', JSON.stringify(hans));
    localStorage.setItem('sward_access_token', 'token-hans');
  });
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it('recarga si en otra ventana entra otra persona', () => {
    const recargar = vi.fn();
    render(
      <AuthProvider alCambiarSesionEnOtraVentana={recargar}>
        <Nombre />
      </AuthProvider>,
    );
    expect(screen.getByText('Hola, Hans')).toBeTruthy();

    otraVentanaEscribe('sward_access_token', 'token-est1');
    otraVentanaEscribe('sward_user', JSON.stringify(estudiante1));

    expect(recargar).toHaveBeenCalledTimes(1);
  });

  it('recarga si en otra ventana se cierra la sesión', () => {
    const recargar = vi.fn();
    render(
      <AuthProvider alCambiarSesionEnOtraVentana={recargar}>
        <Nombre />
      </AuthProvider>,
    );

    otraVentanaEscribe('sward_access_token', null);
    otraVentanaEscribe('sward_user', null);

    expect(recargar).toHaveBeenCalledTimes(1);
  });

  it('no recarga si otra ventana solo renueva el token o edita el perfil de la misma persona', () => {
    const recargar = vi.fn();
    render(
      <AuthProvider alCambiarSesionEnOtraVentana={recargar}>
        <Nombre />
      </AuthProvider>,
    );

    otraVentanaEscribe('sward_access_token', 'token-hans-renovado');
    otraVentanaEscribe('sward_user', JSON.stringify({ ...hans, avatarColor: '#4F46E5' }));

    expect(recargar).not.toHaveBeenCalled();
  });
});
