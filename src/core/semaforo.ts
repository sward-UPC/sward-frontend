/**
 * Color del semáforo para un porcentaje (0–100): verde desde 80 (16 sobre 20),
 * ámbar desde 60 (12 sobre 20) y rojo debajo, como dice la leyenda de la tabla
 * de estudiantes.
 *
 * Lo usan la tabla y el detalle del estudiante, para que un mismo promedio
 * tenga el mismo color en los dos lugares.
 */
export function colorSemaforo(porcentaje: number): string {
  return porcentaje >= 80 ? "text-success" : porcentaje >= 60 ? "text-warning" : "text-destructive";
}
