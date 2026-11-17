import { beforeEach, describe, expect, it, vi } from 'vitest';

const post = vi.hoisted(() => vi.fn());
vi.mock('@core/api/client', () => ({ apiClient: { post } }));

const { registrarMaterialCompletado } = await import('./material.service');

// Defecto 16: el servidor tiene que saber qué recurso se completó.
describe('registrarMaterialCompletado', () => {
  beforeEach(() => post.mockReset().mockResolvedValue({ data: {} }));

  it('manda la dirección del recurso como url_modulo', async () => {
    await registrarMaterialCompletado({
      cursoId: 'c-1',
      concepto: 'Interés simple',
      tipo: 'lectura',
      url: 'https://aula.example.com/mod/page/view.php?id=101',
    });
    expect(post.mock.calls[0][1]).toMatchObject({
      url_modulo: 'https://aula.example.com/mod/page/view.php?id=101',
    });
  });

  it('sin dirección no manda el campo', async () => {
    await registrarMaterialCompletado({ cursoId: 'c-1', concepto: 'Interés simple', tipo: 'video' });
    expect(post.mock.calls[0][1]).not.toHaveProperty('url_modulo');
  });
});
