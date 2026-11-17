import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { SaktRecItem } from '@features/student/sakt.service';
import type { StudentPreferences } from '@features/teacher/services/teacher.service';

// Defecto 16 (HU-034, esc. 3; CP080, grupo 10): la marca «Completado» vivía solo
// en la memoria de la página. Al recargar, el recurso volvía a ofrecer «Ya lo
// revisé», porque el registro no guardaba qué recurso era.

const URL = 'https://aula.example.com/mod/page/view.php?id=101';
const item: SaktRecItem = {
  recurso_id: 'r-101',
  titulo: 'Resumen de interés simple',
  tipo: 'page',
  url: URL,
  motivo: 'Refuerza Interés simple — te cuesta esta sección',
  score: 0.9,
};

const datos = vi.hoisted(() => ({
  preferencias: undefined as StudentPreferences | undefined,
  registrar: vi.fn(),
}));

vi.mock('@features/teacher/hooks/useStudentDetail', () => ({
  useStudentDetail: () => ({ conceptMastery: { data: [], isLoading: false } }),
}));
vi.mock('@features/teacher/hooks/useCourseResources', () => ({
  useCourseResources: () => ({ data: [], isLoading: false }),
}));
vi.mock('@features/teacher/hooks/useStudentPreferences', () => ({
  useStudentPreferences: () => ({ data: datos.preferencias }),
}));
vi.mock('@features/student/useSaktRecommendations', () => ({
  useSaktRecommendations: () => ({ data: [item], isLoading: false }),
}));
vi.mock('@features/student/useGeneratedMaterial', () => ({
  useGeneratedMaterial: () => ({ data: undefined, isLoading: false }),
}));
vi.mock('@features/student/material.service', () => ({
  generarMaterial: vi.fn(),
  registrarMaterialCompletado: datos.registrar,
}));

const { StudentRecursosTab } = await import('./StudentRecursosTab');

function renderizar() {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <StudentRecursosTab estudianteId="e-1" courseId="c-1" moodleCourseId="7" />
    </QueryClientProvider>,
  );
}

describe('Recursos: lo completado se recuerda', () => {
  beforeEach(() => {
    datos.preferencias = {
      por_tipo: [],
      tipo_fuerte: '',
      tipo_debil: '',
      recursos_vistos: [],
      recursos_completados: [],
    };
    datos.registrar.mockReset().mockResolvedValue(undefined);
  });
  afterEach(cleanup);

  it('al volver a la página, el recurso que el servidor tiene como completado sigue «Completado»', () => {
    datos.preferencias!.recursos_completados = [URL];
    renderizar();
    expect(screen.getByText('Completado')).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Ya lo revisé/ })).toBeNull();
  });

  it('al marcarlo, avisa al servidor qué recurso fue', async () => {
    renderizar();
    fireEvent.click(screen.getByRole('button', { name: /Ya lo revisé/ }));
    await waitFor(() => expect(datos.registrar).toHaveBeenCalledTimes(1));
    expect(datos.registrar.mock.calls[0][0]).toMatchObject({ url: URL, tipo: 'lectura' });
  });
});
