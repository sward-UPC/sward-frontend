# Pendientes — Panel Docente (conexión a APIs reales)

Estado tras conectar el **dashboard de estudiantes** a datos reales
(`GET /dashboard/teacher/{courseId}/students-progress`, ms-trazabilidad,
ya enriquecido con nombre/correo vía s2s a ms-usuarios).

> Regla aplicada: **no se quitó ninguna funcionalidad**. Lo que el backend aún
> no soporta sigue funcionando con datos mock y queda listado aquí.

## ✅ Ya conectado a datos reales
- **Lista de estudiantes** (tabs Resumen y Estudiantes): nombre, correo, nivel
  de riesgo, puntaje promedio, nº de interacciones y recursos completados.
- Métricas derivadas (conteos por riesgo, promedio de dominio) ahora salen de
  los estudiantes reales.
- Fallback automático a mock si no hay curso o el backend no devuelve datos.

## ⏳ Pendiente — requiere backend nuevo en ms-trazabilidad
1. **Alertas** (`AlertsPanel`, notificaciones): no existe `/teacher/alerts` ni
   tabla de alertas. Hoy usa `mockTeacherNotifications`. → crear endpoint + tabla.
2. **Tendencia de clase** (tab Análisis, `trendData`): no existe
   `/teacher/class/progress` (agregación semanal). Hoy usa `mockTrendData`.
3. **Engagement por estudiante** (`engagementData` y campo `engagement`): el
   backend no lo calcula. Hoy `engagement = 0` y gráfica usa `mockEngagementData`.
4. **Exportar reportes** (tab Reportes): no existe `/teacher/reports/export`.
   El botón sigue mostrando el comportamiento mock.
5. **Feedback docente** (`FeedbackDialog`): no existe `/teacher/feedback` ni
   persistencia. Hoy es solo UI.

## ⏳ Pendiente — enriquecer el endpoint existente
6. **Campos faltantes en `students-progress`**: `conceptsAtRisk`, `lastActivity`.
   Hoy se rellenan con `0` / `''`. `academic_progress` ya guarda `ultima_actividad`
   → exponerla en el response del dashboard.
7. **Detalle de estudiante** (`StudentDetailView`): aún usa mock. Existen
   `/students/{id}/progress`, `/indicators`, `/interactions` (reales) → cablear
   usando `estudianteId` (UUID) que ya viaja en `StudentProgress`.

## ✅ Detalle de estudiante (`StudentDetailView`) — parcialmente conectado
Conectado a datos reales de ms-trazabilidad vía `useStudentDetail(estudianteId, courseId)`
(hook nuevo en `src/features/teacher/hooks/useStudentDetail.ts`), con fallback a
mock cuando falta `estudianteId` (UUID) o el curso activo. Endpoints usados:
`/students/{id}/progress`, `/students/{id}/indicators`, `/students/{id}/interactions`.

- **Real ahora:**
  - *Dominio Promedio*: usa `puntaje_promedio` de `/progress` (cae a `student.avgMastery` si no hay).
  - *Historial de Interacciones*: lista real desde `/interactions` (mock como fallback,
    con aviso "datos de ejemplo" cuando no hay reales).
- **Aún mock dentro del detalle (sin endpoint adecuado):**
  - *Evolución del Dominio* (progreso semanal por estudiante): no existe endpoint → mock.
  - *Dominio por Concepto* (barras): `/indicators` devuelve indicadores genéricos
    (nombre/valor/unidad), no dominio por concepto → mock. El servicio ya expone
    `getStudentIndicators` por si se quiere graficar los indicadores reales.
  - *Vista Rápida de Dominio (radar)* y *Heatmap de Atención (XAI)*: sin endpoint → mock.
  - *Recomendaciones de Intervención*: contenido fijo de ejemplo → mock.
- **Gaps de mapeo en `/interactions`:**
  - El endpoint NO expone la corrección de la respuesta; todas las interacciones se
    marcan como "Completado" en el UI para no mostrar el ícono de error engañosamente.
    → exponer si la respuesta fue correcta para diferenciar Completado/Incorrecto.
  - `actividad_id` no está resuelto a nombre de recurso/concepto; el UI muestra
    "Actividad {id-corto}". → resolver `actividad_id` → nombre vía ms-cursos-recursos.
  - `tipo` (vista/respuesta/descarga/completado) se mapea a una etiqueta legible.

## ⏳ Pendiente — UX
8. **Selector de curso**: hoy se toma automáticamente `courses[0]`. Falta un
   selector real en la UI y que `/courses` filtre por el docente autenticado
   (`docente_id`). El hook ya expone `courses`, `activeCourseId`, `setActiveCourseId`.
9. **Nivel de riesgo 4→3**: el UI maneja 3 niveles (high/medium/low) y el backend
   4 (crítico/alto/medio/bajo). Hoy `crítico` y `alto` se colapsan en `high`.
   Evaluar agregar `critico` al UI para no perder el matiz.
