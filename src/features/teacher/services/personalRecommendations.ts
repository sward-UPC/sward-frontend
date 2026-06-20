import type { CourseResource, ConceptMastery, StudentPreferences } from './teacher.service';

/**
 * Motor de recomendación personalizada: combina las secciones débiles del
 * estudiante (SAKT/dominio), su preferencia de formato (en qué tipo de recurso
 * rinde mejor) y el catálogo real de recursos de Moodle, para sugerir el
 * material ideal para cada quien — con el porqué (explicable).
 */

/** Tipos de módulo Moodle que son material de lectura/estudio. */
const TIPOS_LECTURA = new Set(['page', 'resource', 'url', 'book', 'folder', 'label']);

/** Etiqueta legible por tipo de módulo Moodle. */
export const TIPO_RECURSO_LABEL: Record<string, string> = {
  page: 'Lectura',
  resource: 'Material',
  url: 'Enlace / Video',
  book: 'Libro',
  folder: 'Carpeta',
  quiz: 'Quiz',
  assign: 'Práctica',
  workshop: 'Taller',
  lesson: 'Lección',
  scorm: 'Lección',
  forum: 'Foro',
};

export function tipoLabel(tipo: string): string {
  return TIPO_RECURSO_LABEL[tipo] ?? (tipo ? tipo[0].toUpperCase() + tipo.slice(1) : 'Recurso');
}

export interface RecursoRecomendado {
  concepto: string;
  dominio: number;
  recurso: CourseResource;
  /** Explicación de por qué se recomienda (XAI). */
  motivo: string;
}

/**
 * Construye recomendaciones personalizadas de recursos.
 * @param weak Conceptos/secciones con su dominio (vienen del backend, peor→mejor).
 * @param recursos Catálogo de recursos del curso (todos los tipos, con URL).
 * @param prefs Preferencia de formato del estudiante (opcional).
 */
export function construirRecursosRecomendados(
  weak: ConceptMastery[],
  recursos: CourseResource[],
  prefs?: StudentPreferences,
): RecursoRecomendado[] {
  const tipoFuerte = prefs?.tipo_fuerte || '';
  const recs: RecursoRecomendado[] = [];
  const usados = new Set<string>();

  // Solo secciones flojas (dominio < 60), las 3 peores.
  const secciones = weak.filter((c) => c.dominio < 60).slice(0, 3);

  for (const c of secciones) {
    const candidatos = recursos.filter(
      (r) => r.seccion && r.seccion === c.concepto && r.url && !usados.has(r.url),
    );
    if (candidatos.length === 0) continue;

    // Puntúa cada candidato: prioriza el formato que mejor le funciona al
    // estudiante; luego material de lectura/estudio para reforzar.
    const ranked = [...candidatos].sort((a, b) => puntua(b, tipoFuerte) - puntua(a, tipoFuerte));
    const elegido = ranked[0];
    usados.add(elegido.url);

    recs.push({
      concepto: c.concepto,
      dominio: c.dominio,
      recurso: elegido,
      motivo: explicar(c, elegido, tipoFuerte),
    });
  }

  return recs;
}

function puntua(r: CourseResource, tipoFuerte: string): number {
  let s = 0;
  if (tipoFuerte && r.tipo === tipoFuerte) s += 3; // el formato que mejor le va
  if (TIPOS_LECTURA.has(r.tipo)) s += 1; // material de estudio para reforzar
  return s;
}

function explicar(c: ConceptMastery, r: CourseResource, tipoFuerte: string): string {
  const base = `Refuerza ${c.concepto}, donde estás al ${c.dominio}%.`;
  if (tipoFuerte && r.tipo === tipoFuerte) {
    return `${base} Es un(a) ${tipoLabel(r.tipo).toLowerCase()}, el formato en el que mejor te va.`;
  }
  if (TIPOS_LECTURA.has(r.tipo)) {
    return `${base} Lectura de apoyo para afianzar el concepto.`;
  }
  return base;
}
