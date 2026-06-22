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
  /** Rol en el refuerzo: estudiar (aprender) o practicar (aplicar). */
  rol: 'estudiar' | 'practicar';
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
  // Si rinde mejor con actividades de práctica (quiz/tarea/taller), lideramos con
  // práctica en vez de "estudiar primero". Así el orden refleja su preferencia.
  const prefierePractica = !!prefs?.tipo_fuerte && TIPOS_PRACTICA.has(prefs.tipo_fuerte);
  const recs: RecursoRecomendado[] = [];
  const usados = new Set<string>();

  // Conceptos débiles según el estado de conocimiento (peor→mejor). Las 3 peores.
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

    // Combo de refuerzo por concepto débil: material para ESTUDIAR (lectura/
    // video, en el formato que más consume) + actividad para PRACTICAR (quiz/
    // tarea). Así reforzamos con variedad: aprender → aplicar.
    const estudio = candidatos
      .filter((r) => TIPOS_ESTUDIO.has(r.tipo))
      .sort(
        (a, b) =>
          (b.tipo === formatoConsumido ? 1 : 0) - (a.tipo === formatoConsumido ? 1 : 0),
      );
    const practica = candidatos.filter((r) => TIPOS_PRACTICA.has(r.tipo));

    const itemEstudio: RecursoRecomendado | null = estudio[0]
      ? {
          concepto: c.concepto,
          dominio: c.dominio,
          recurso: estudio[0],
          rol: 'estudiar',
          motivo: explicarEstudio(c, estudio[0], formatoConsumido),
        }
      : null;
    const itemPractica: RecursoRecomendado | null = practica[0]
      ? {
          concepto: c.concepto,
          dominio: c.dominio,
          recurso: practica[0],
          rol: 'practicar',
          motivo: explicarPractica(c, practica[0], prefierePractica),
        }
      : null;

    // Orden según preferencia: si rinde mejor practicando, la práctica va primero.
    const elegidos: RecursoRecomendado[] = (
      prefierePractica ? [itemPractica, itemEstudio] : [itemEstudio, itemPractica]
    ).filter((e): e is RecursoRecomendado => e !== null);
    // Si la sección no tiene ni estudio ni práctica clara, recomendá lo que haya.
    if (elegidos.length === 0) {
      const r = candidatos[0];
      elegidos.push({
        concepto: c.concepto,
        dominio: c.dominio,
        recurso: r,
        rol: TIPOS_PRACTICA.has(r.tipo) ? 'practicar' : 'estudiar',
        motivo: explicarEstudio(c, r, formatoConsumido),
      });
    }

    for (const e of elegidos) {
      usados.add(e.recurso.url);
      recs.push(e);
    }
  }

  return recs;
}

function explicarEstudio(c: ConceptMastery, r: CourseResource, formatoConsumido: string): string {
  const base = `Para reforzar ${c.concepto} (estás al ${c.dominio}%):`;
  if (formatoConsumido && r.tipo === formatoConsumido) {
    return `${base} estudia este(a) ${tipoLabel(r.tipo).toLowerCase()} — el formato que más usas.`;
  }
  return `${base} estudia este(a) ${tipoLabel(r.tipo).toLowerCase()} para afianzar el concepto.`;
}

function explicarPractica(c: ConceptMastery, r: CourseResource, prefierePractica = false): string {
  if (prefierePractica) {
    return `Empieza practicando con este(a) ${tipoLabel(r.tipo).toLowerCase()} de ${c.concepto} — es el formato en el que rindes mejor.`;
  }
  return `Y luego aplica lo aprendido con este(a) ${tipoLabel(r.tipo).toLowerCase()} de ${c.concepto}.`;
}
