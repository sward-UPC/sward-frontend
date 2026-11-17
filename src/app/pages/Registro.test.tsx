import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';
import { Registro } from './Registro';

// Defecto 42 (CP019, grupo 10): con un correo sin dominio el formulario lo
// rechazaba, pero no resaltaba el campo que tenía el error.

function renderizar() {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <Registro />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

function llenar(datos: { correo: string; password: string }) {
  fireEvent.change(screen.getByLabelText('Nombres'), { target: { value: 'Hans' } });
  fireEvent.change(screen.getByLabelText('Apellidos'), { target: { value: 'Prueba' } });
  fireEvent.change(screen.getByLabelText('Carrera'), { target: { value: 'Ingeniería Empresarial' } });
  fireEvent.change(screen.getByLabelText('Correo'), { target: { value: datos.correo } });
  fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: datos.password } });
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(screen.getByRole('button', { name: 'Crear mi cuenta' }));
}

describe('Registro: el campo con el error se resalta', () => {
  afterEach(cleanup);

  it('marca el correo sin dominio, lo enlaza al mensaje y le pone el foco', () => {
    renderizar();
    llenar({ correo: 'test', password: 'Clave1234' });

    const correo = screen.getByLabelText('Correo');
    const mensaje = screen.getByRole('alert');
    expect(mensaje.textContent).toContain('Ingresa un correo válido.');
    expect(correo.getAttribute('aria-invalid')).toBe('true');
    expect(correo.getAttribute('aria-describedby')).toBe(mensaje.id);
    expect(document.activeElement).toBe(correo);
  });

  it('resalta solo el campo que falló', () => {
    renderizar();
    llenar({ correo: 'hans@example.com', password: 'corta' });

    expect(screen.getByLabelText('Contraseña').getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByLabelText('Correo').getAttribute('aria-invalid')).toBeNull();
  });
});
