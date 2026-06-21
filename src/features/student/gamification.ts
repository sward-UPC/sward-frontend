/**
 * Lógica pura de gamificación del panel del estudiante.
 *
 * Todo se calcula a partir de la data REAL que ya trae `useStudentDetail`
 * (interacciones y dominio por concepto); aquí no se inventan números.
 */

/** Total de pasos de la ruta de aprendizaje que mostramos al alumno. */
export const RUTA_TOTAL = 5;

/** Dominio (0-100) a partir del cual consideramos un concepto "dominado". */
export const UMBRAL_DOMINIO = 70;

/**
 * Convierte la fecha de una interacción al día local en formato `YYYY-MM-DD`.
 *
 * `getStudentInteractions` ya formatea `fecha` (ISO) a `dd/mm/aa hh:mm` en hora
 * local, así que aceptamos ese formato; como respaldo, también parseamos un ISO
 * directo. Devuelve `null` si no se puede interpretar la fecha.
 */
export function diaLocalDesdeFecha(fecha: string): string | null {
  if (!fecha) return null;

  // Formato del servicio: "dd/mm/aa hh:mm" (hora local).
  const m = fecha.match(/^(\d{2})\/(\d{2})\/(\d{2})/);
  if (m) {
    const [, dd, mm, yy] = m;
    return `20${yy}-${mm}-${dd}`;
  }

  // Respaldo: cualquier fecha que Date pueda interpretar (p. ej. ISO 8601).
  const d = new Date(fecha);
  if (Number.isNaN(d.getTime())) return null;
  const yyyy = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mes}-${dia}`;
}

/** Día local de "hoy" como `YYYY-MM-DD` (inyectable para tests). */
function diaLocalHoy(hoy: Date = new Date()): string {
  const yyyy = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${yyyy}-${mes}-${dia}`;
}

/** `YYYY-MM-DD` → días desde epoch (UTC), para comparar días sin desfase horario. */
function diaANumero(dia: string): number {
  const [y, m, d] = dia.split('-').map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
}

/**
 * Racha de días consecutivos con actividad terminando en el día más reciente.
 *
 * Reglas:
 *  - Se toman las fechas de las interacciones, se reducen a días únicos.
 *  - La racha solo "vive" si el último día activo es HOY o AYER; si es más
 *    antiguo, se considera rota → 0.
 *  - Se cuentan los días consecutivos hacia atrás desde ese último día activo.
 *
 * Casos borde: sin data → 0; un solo día (hoy/ayer) → 1; huecos cortan el conteo.
 */
export function calcularRacha(fechas: string[], hoy: Date = new Date()): number {
  const dias = new Set<string>();
  for (const f of fechas) {
    const dia = diaLocalDesdeFecha(f);
    if (dia) dias.add(dia);
  }
  if (dias.size === 0) return 0;

  const nums = [...dias].map(diaANumero).sort((a, b) => b - a); // desc
  const hoyNum = diaANumero(diaLocalHoy(hoy));
  const ultimo = nums[0];

  // El último día activo debe ser hoy o ayer; si no, la racha está rota.
  if (hoyNum - ultimo > 1) return 0;

  let racha = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i - 1] - nums[i] === 1) racha++;
    else break;
  }
  return racha;
}

export interface RutaProgreso {
  completados: number;
  total: number;
}

/**
 * Progreso de la "ruta de aprendizaje": cuántos conceptos están dominados
 * sobre un total de hasta `RUTA_TOTAL` (5) pasos.
 *
 * Denominador = min(5, nº de conceptos) (5 si hay 5 o más); si no hay conceptos
 * aún, total = 5 y completados = 0. Numerador = conceptos con dominio ≥ 70.
 */
export function calcularRuta(
  conceptos: { dominio: number }[] | undefined,
): RutaProgreso {
  const cm = conceptos ?? [];
  if (cm.length === 0) return { completados: 0, total: RUTA_TOTAL };

  const total = Math.min(RUTA_TOTAL, cm.length);
  const dominados = cm.filter((c) => c.dominio >= UMBRAL_DOMINIO).length;
  const completados = Math.min(dominados, total);
  return { completados, total };
}
