import type { StudentProgress } from '@core/types';

/**
 * Generación de reportes reales del docente en formato CSV (compatible con
 * Excel/Sheets) a partir de los datos reales del curso. No usa data mock.
 */

const RISK_LABEL: Record<string, string> = {
  high: 'Alto',
  medium: 'Medio',
  low: 'Bajo',
};
const RISK_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

/** Escapa un valor para CSV (separador `;`, estándar Excel en locale ES). */
function escapeCsv(value: string | number): string {
  const s = String(value ?? '');
  return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Construye el contenido CSV con BOM UTF-8 para que Excel respete los acentos. */
function buildCsv(headers: string[], rows: (string | number)[][]): string {
  const lines = [headers, ...rows].map((r) => r.map(escapeCsv).join(';'));
  return '﻿' + lines.join('\r\n');
}

/** Dispara la descarga de un archivo de texto en el navegador. */
function downloadFile(filename: string, content: string, mime = 'text/csv;charset=utf-8'): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Marca de fecha `aaaa-mm-dd` para los nombres de archivo. */
function fileStamp(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const slug = (s?: string) =>
  (s || 'curso')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'curso';

/** Reporte: análisis de estudiantes en riesgo (alto/medio), peor primero. */
export function downloadRiskAnalysisCsv(students: StudentProgress[], cursoNombre?: string): void {
  const atRisk = students
    .filter((s) => s.riskLevel !== 'low')
    .sort((a, b) => RISK_ORDER[a.riskLevel] - RISK_ORDER[b.riskLevel] || a.avgMastery - b.avgMastery);
  const rows = atRisk.map((s) => [
    s.name,
    s.email,
    RISK_LABEL[s.riskLevel] ?? s.riskLevel,
    s.avgMastery,
    s.conceptsAtRisk,
    s.engagement,
    s.lastActivity,
  ]);
  const csv = buildCsv(
    ['Estudiante', 'Correo', 'Nivel de Riesgo', 'Dominio (%)', 'Conceptos en Riesgo', 'Engagement (%)', 'Última Actividad'],
    rows,
  );
  downloadFile(`analisis-riesgo_${slug(cursoNombre)}_${fileStamp()}.csv`, csv);
}

/** Reporte: registro de engagement y dominio por estudiante. */
export function downloadEngagementCsv(students: StudentProgress[], cursoNombre?: string): void {
  const rows = [...students]
    .sort((a, b) => b.engagement - a.engagement)
    .map((s) => [s.name, s.email, s.engagement, s.avgMastery, RISK_LABEL[s.riskLevel] ?? s.riskLevel, s.lastActivity]);
  const csv = buildCsv(
    ['Estudiante', 'Correo', 'Engagement (%)', 'Dominio (%)', 'Nivel de Riesgo', 'Última Actividad'],
    rows,
  );
  downloadFile(`registro-engagement_${slug(cursoNombre)}_${fileStamp()}.csv`, csv);
}

/** Reporte: mapa de conocimiento — estado de dominio del grupo por estudiante. */
export function downloadKnowledgeMapCsv(students: StudentProgress[], cursoNombre?: string): void {
  const ordenados = [...students].sort((a, b) => b.avgMastery - a.avgMastery);
  const rows = ordenados.map((s) => [
    s.name,
    s.avgMastery,
    s.avgMastery >= 75 ? 'Dominado' : s.avgMastery >= 55 ? 'En proceso' : 'Inicial',
    s.conceptsAtRisk,
    RISK_LABEL[s.riskLevel] ?? s.riskLevel,
  ]);
  // Fila de promedio grupal al final.
  if (ordenados.length) {
    const prom = Math.round(ordenados.reduce((a, s) => a + s.avgMastery, 0) / ordenados.length);
    rows.push(['Promedio del grupo', prom, '', '', '']);
  }
  const csv = buildCsv(
    ['Estudiante', 'Dominio (%)', 'Estado', 'Conceptos en Riesgo', 'Nivel de Riesgo'],
    rows,
  );
  downloadFile(`mapa-conocimiento_${slug(cursoNombre)}_${fileStamp()}.csv`, csv);
}
