/**
 * Formato de aprendizaje de un recurso (HU-026).
 *
 * Las recomendaciones del SAKT y el catálogo de Moodle nombran los tipos con
 * vocabularios distintos: el motor dice «ejercicio» o «lectura»; Moodle dice
 * «assign» o «page». Para que un solo filtro sirva en ambas listas, los dos se
 * reducen aquí a los mismos cuatro formatos.
 */
export type Formato = 'practica' | 'quiz' | 'lectura' | 'video';

const FORMATO_POR_TIPO: Record<string, Formato> = {
  // Vocabulario del motor de recomendación (ms-recomendacion).
  ejercicio: 'practica',
  quiz: 'quiz',
  lectura: 'lectura',
  presentacion: 'lectura',
  video: 'video',
  // Tipos de módulo de Moodle (catálogo del curso).
  assign: 'practica',
  workshop: 'practica',
  page: 'lectura',
  book: 'lectura',
  resource: 'lectura',
  folder: 'lectura',
  lesson: 'lectura',
  // Un enlace de Moodle puede ser un video, pero el tipo no lo distingue.
  url: 'lectura',
};

export const FORMATO_LABEL: Record<Formato, string> = {
  practica: 'Práctica',
  quiz: 'Quiz',
  lectura: 'Lectura',
  video: 'Video',
};

/** Orden estable de los chips del filtro. */
export const FORMATOS: Formato[] = ['practica', 'quiz', 'lectura', 'video'];

export function formatoDe(tipo: string | undefined | null): Formato | null {
  if (!tipo) return null;
  return FORMATO_POR_TIPO[tipo.toLowerCase()] ?? null;
}

/**
 * Tipo que espera `/interactions/material-completed`. El quiz cuenta como
 * práctica: es una actividad calificada y, como tal, alimenta al SAKT.
 */
export function tipoParaRegistro(formato: Formato): 'practica' | 'lectura' | 'video' {
  return formato === 'quiz' ? 'practica' : formato;
}

/** Las prácticas y los quizzes cambian el dominio estimado; las lecturas, no. */
export function alimentaAlModelo(formato: Formato): boolean {
  return formato === 'practica' || formato === 'quiz';
}
