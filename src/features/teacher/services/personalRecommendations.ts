import type { CourseResource, ConceptMastery, StudentPreferences } from './teacher.service';

/**
 * Motor de recomendación personalizada: combina las secciones débiles del
 * estudiante (SAKT/dominio), su preferencia de formato (en qué tipo de recurso
 * rinde mejor) y el catálogo real de recursos de Moodle, para sugerir el
 * material ideal para cada quien — con el porqué (explicable).
 */

/** Material de ESTUDIO (para reforzar el concepto): lecturas, videos, recursos. */
const TIPOS_ESTUDIO = new Set(['page', 'resource', 'url', 'book', 'folder', 'lesson']);
/** Actividades de PRÁCTICA/evaluación (se hacen DESPUÉS de reforzar). */
const TIPOS_PRACTICA = new Set(['quiz', 'assign', 'workshop']);

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
  const formatoConsumido = prefs?.formato_mas_consumido || '';
  const vistos = new Set(prefs?.recursos_vistos ?? []);
  const recs: RecursoRecomendado[] = [];
  const usados = new Set<string>();

  // Solo secciones flojas (dominio < 60), las 3 peores.
  const secciones = weak.filter((c) => c.dominio < 60).slice(0, 3);

  for (const c of secciones) {
    const candidatos = recursos.filter(
      (r) =>
        r.seccion &&
        r.seccion === c.concepto &&
        r.url &&
        r.tipo !== 'forum' && // los foros no son material de refuerzo
        !usados.has(r.url) &&
        !vistos.has(r.url), // no re-recomendar lo que ya vio
    );
    if (candidatos.length === 0) continue;

    // Para REFORZAR: material de estudio primero (en el formato que más consume),
    // la práctica/evaluación queda como último recurso.
    const ranked = [...candidatos].sort(
      (a, b) => puntua(b, formatoConsumido) - puntua(a, formatoConsumido),
    );
    const elegido = ranked[0];
    usados.add(elegido.url);

    recs.push({
      concepto: c.concepto,
      dominio: c.dominio,
      recurso: elegido,
      motivo: explicar(c, elegido, formatoConsumido),
    });
  }

  return recs;
}

function puntua(r: CourseResource, formatoConsumido: string): number {
  let s = 0;
  if (TIPOS_ESTUDIO.has(r.tipo)) s += 5; // reforzar = estudiar primero
  if (formatoConsumido && r.tipo === formatoConsumido) s += 2; // el formato que más consume
  if (TIPOS_PRACTICA.has(r.tipo)) s += 1; // práctica solo si no hay material de estudio
  return s;
}

function explicar(c: ConceptMastery, r: CourseResource, formatoConsumido: string): string {
  const base = `Refuerza ${c.concepto}, donde estás al ${c.dominio}%.`;
  if (TIPOS_ESTUDIO.has(r.tipo)) {
    if (formatoConsumido && r.tipo === formatoConsumido) {
      return `${base} Es un(a) ${tipoLabel(r.tipo).toLowerCase()} — el formato que más usas — para estudiar el tema antes de volver a practicar.`;
    }
    return `${base} Material de estudio para afianzar el concepto antes de volver a practicar.`;
  }
  return `${base} Practica con este ${tipoLabel(r.tipo).toLowerCase()} para evaluar tu avance.`;
}
