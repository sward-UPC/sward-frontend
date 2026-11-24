import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

// Defecto 29 (HU-050, esc. 2; CP134, grupo 10): en el detalle del estudiante la
// «Nota promedio» se pintaba siempre en rojo, aunque en la tabla el mismo
// promedio (17.0 / 20) apareciera en verde, y «Conceptos en Riesgo» salía en
// rojo también cuando valía 0.

const vacio = { data: undefined, isLoading: false, isError: false };

// Los gráficos miden su contenedor con ResizeObserver, que el DOM simulado no trae.
vi.stubGlobal(
  'ResizeObserver',
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
);

vi.mock('@features/teacher/hooks/useStudentDetail', () => ({
  useStudentDetail: () => ({
    enabled: false,
    progress: vacio,
    interactions: vacio,
    attention: vacio,
    conceptMastery: vacio,
    weeklyProgress: vacio,
  }),
}));
vi.mock('@features/teacher/hooks/useCourseResources', () => ({
  useCourseResources: () => ({ data: [] }),
}));
vi.mock('@features/teacher/hooks/useStudentPreferences', () => ({
  useStudentPreferences: () => ({ data: undefined }),
}));
vi.mock('../xai/DomainRadar', () => ({ DomainRadar: () => null }));
vi.mock('../xai/AttentionHeatmap', () => ({ AttentionHeatmap: () => null }));
vi.mock('./StudentInteractionsList', () => ({ StudentInteractionsList: () => null }));
vi.mock('./RecommendedResources', () => ({ RecommendedResources: () => null }));

const { StudentDetailView } = await import('./StudentDetailView');

function renderizar(avgMastery: number, conceptsAtRisk: number) {
  render(
    <StudentDetailView
      student={{
        id: 1,
        name: 'Estudiante 1 Prueba G11',
        email: 'estudiante1.qa.g11@example.com',
        riskLevel: 'low',
        avgMastery,
        conceptsAtRisk,
        lastActivity: 'Hace 18 días',
        engagement: 60,
      }}
      onClose={() => {}}
      onSendFeedback={() => {}}
    />,
  );
}

describe('Detalle del estudiante: colores coherentes con la tabla', () => {
  afterEach(cleanup);

  it('una nota de 16 o más se muestra en verde, como en la tabla', () => {
    renderizar(85, 0);
    const nota = screen.getByText('17.0 / 20');
    expect(nota.className).toContain('text-success');
    expect(nota.className).not.toContain('text-destructive');
  });

  it('una nota entre 12 y 15.9 se muestra en ámbar', () => {
    renderizar(64, 1);
    expect(screen.getByText('12.8 / 20').className).toContain('text-warning');
  });

  it('una nota menor de 12 sigue en rojo', () => {
    renderizar(25, 3);
    expect(screen.getByText('5.0 / 20').className).toContain('text-destructive');
  });

  it('«Conceptos en Riesgo» en 0 no lleva color de alerta', () => {
    renderizar(85, 0);
    const cifra = screen.getByText('Conceptos en Riesgo').nextElementSibling;
    expect(cifra?.textContent).toBe('0');
    expect(cifra?.className).not.toContain('text-destructive');
  });

  it('«Conceptos en Riesgo» mayor que 0 sí lleva color de alerta', () => {
    renderizar(25, 3);
    const cifra = screen.getByText('Conceptos en Riesgo').nextElementSibling;
    expect(cifra?.className).toContain('text-destructive');
  });
});
