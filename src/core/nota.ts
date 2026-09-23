/**
 * La nota, en la escala vigesimal peruana.
 *
 * Los servicios manejan la nota como porcentaje del máximo: ms-integracion-lms
 * la calcula `graderaw / grademax * 100` al traerla de Moodle, y ms-trazabilidad
 * promedia ese número. En pantalla, en cambio, el estudiante y su profesor leen
 * **0 a 20**, que es lo que ven en el aula: un «54 %» al lado del «10.8» de
 * Moodle obliga a traducir de cabeza y se presta a leer 54 como si fuera nota.
 *
 * La conversión vive solo aquí, y solo se aplica a notas. Lo que no es nota
 * —los aciertos por tema, el engagement, la probabilidad que estima el modelo—
 * sigue en porcentaje, porque son proporciones y no calificaciones.
 */

export const NOTA_MAXIMA = 20;

/** Convierte un porcentaje del máximo (0–100) a la escala 0–20. */
export function aVigesimal(porcentajeDelMaximo: number): number {
  const acotado = Math.min(100, Math.max(0, porcentajeDelMaximo));
  return Math.round((acotado / 100) * NOTA_MAXIMA * 10) / 10;
}

/** La nota lista para mostrar, con un decimal: `10.8`. */
export function nota(porcentajeDelMaximo: number): string {
  return aVigesimal(porcentajeDelMaximo).toFixed(1);
}

/** La nota con su escala explícita: `10.8 / 20`. Para cifras sueltas. */
export function notaConEscala(porcentajeDelMaximo: number): string {
  return `${nota(porcentajeDelMaximo)} / ${NOTA_MAXIMA}`;
}
