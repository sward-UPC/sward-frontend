import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { X, MessageSquare, TrendingUp, AlertTriangle } from "lucide-react";
import { DomainRadar } from "../xai/DomainRadar";
import { AttentionHeatmap } from "../xai/AttentionHeatmap";
import { StudentInteractionsList } from "./StudentInteractionsList";
import { useStudentDetail } from "@features/teacher/hooks/useStudentDetail";
import {
  mockStudentProgressPoints,
  mockConceptMasteryPoints,
  mockStudentInteractions,
  mockAttentionInteractions,
  mockStudentDomainPoints,
} from "@mocks/data/teacher.mock";

interface StudentData {
  id: number;
  /** UUID real del estudiante en el backend (para datos reales). */
  estudianteId?: string;
  name: string;
  email: string;
  riskLevel: string;
  avgMastery: number;
  conceptsAtRisk: number;
  lastActivity: string;
  engagement: number;
}

interface StudentDetailViewProps {
  student: StudentData;
  /** Curso activo; junto a `student.estudianteId` habilita los datos reales. */
  courseId?: string;
  onClose: () => void;
  onSendFeedback: () => void;
}

function getRiskBadge(level: string) {
  switch (level) {
    case "high":
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="w-3 h-3" />
          Riesgo Alto
        </Badge>
      );
    case "medium":
      return <Badge variant="warning" className="gap-1">Riesgo Medio</Badge>;
    case "low":
      return (
        <Badge variant="success" className="gap-1">
          <TrendingUp className="w-3 h-3" />
          Bajo Riesgo
        </Badge>
      );
    default:
      return null;
  }
}

interface ConceptMasteryItem {
  concepto: string;
  dominio: number;
  total: number;
}

/** Recomendaciones de intervención derivadas de datos reales del estudiante. */
function buildRecomendaciones(
  conceptos: ConceptMasteryItem[],
  engagement: number,
  lastActivity: string,
): { titulo: string; descripcion: string }[] {
  const recs: { titulo: string; descripcion: string }[] = [];
  // Secciones más débiles (vienen ordenadas peor→mejor desde el backend).
  for (const c of conceptos.filter((x) => x.dominio < 60).slice(0, 2)) {
    const nivel = c.dominio < 40 ? "crítico" : "bajo";
    recs.push({
      titulo: `Reforzar ${c.concepto}`,
      descripcion: `Dominio ${nivel} (${c.dominio}%) en ${c.total} interacción${c.total === 1 ? "" : "es"}. Sugerir tutoría o recursos adicionales en esta sección.`,
    });
  }
  if (engagement < 50) {
    recs.push({
      titulo: "Aumentar engagement",
      descripcion: `Engagement bajo (${engagement}%).${lastActivity ? ` Última actividad: ${lastActivity}.` : ""} Enviar recordatorio o mensaje de motivación.`,
    });
  }
  if (recs.length === 0) {
    recs.push({
      titulo: "Buen desempeño",
      descripcion: "El estudiante mantiene un dominio adecuado en todas las secciones. Reforzar con retos avanzados.",
    });
  }
  return recs;
}

export function StudentDetailView({ student, courseId, onClose, onSendFeedback }: StudentDetailViewProps) {
  // Datos REALES (ms-trazabilidad) cuando hay UUID + curso; si no, cae al mock.
  const { enabled, progress, interactions, attention, conceptMastery, weeklyProgress } =
    useStudentDetail(student.estudianteId, courseId);

  const realProgress = progress.data;
  // Dominio promedio: usa el puntaje real cuando está disponible.
  const avgMastery = realProgress?.puntajePromedio ?? student.avgMastery;

  // Dominio por concepto/sección REAL → radar, barras y recomendaciones.
  const cm = enabled && conceptMastery.data && conceptMastery.data.length > 0
    ? conceptMastery.data
    : null;
  const radarData = cm
    ? cm.map((c) => ({ subject: c.concepto, value: c.dominio, fullMark: 100 }))
    : mockStudentDomainPoints;
  const conceptBars = cm
    ? cm.map((c) => ({ concept: c.concepto, mastery: c.dominio }))
    : mockConceptMasteryPoints;

  // Evolución del dominio REAL (curva por etapas).
  const evolution = enabled && weeklyProgress.data && weeklyProgress.data.length > 0
    ? weeklyProgress.data
    : mockStudentProgressPoints;
  const evolutionIsReal = enabled && !!weeklyProgress.data && weeklyProgress.data.length > 0;
  const evolTrend =
    evolutionIsReal && evolution.length >= 2
      ? evolution[evolution.length - 1].mastery - evolution[0].mastery
      : null;

  // Recomendaciones de intervención derivadas de datos reales.
  const recomendaciones = cm
    ? buildRecomendaciones(cm, student.engagement, student.lastActivity)
    : null;

  // Historial de interacciones: real si hay datos, mock como fallback.
  const interactionsList =
    enabled && interactions.data && interactions.data.length > 0
      ? interactions.data
      : mockStudentInteractions;
  const interactionsAreReal = enabled && !!interactions.data && interactions.data.length > 0;

  // Heatmap de atención SAKT: pesos reales (ms-recomendacion) o mock como fallback.
  const attentionIsReal =
    enabled && !!attention.data && attention.data.interactions.length > 0;
  const attentionInteractions = attentionIsReal
    ? attention.data!.interactions
    : mockAttentionInteractions;
  const attentionPrediction = attentionIsReal
    ? attention.data!.prediction
    : 'Probabilidad de éxito en próximo ejercicio de Redes Neuronales: 38%. Se recomienda intervención docente.';

  return (
    <Card className="border-primary">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle>{student.name}</CardTitle>
              {getRiskBadge(student.riskLevel)}
            </div>
            <CardDescription>{student.email}</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Cerrar detalle">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Dominio Promedio</p>
                <p className="text-2xl font-bold text-destructive">{avgMastery}%</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Engagement</p>
                <p className="text-2xl font-bold">{student.engagement}%</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Conceptos en Riesgo</p>
                <p className="text-2xl font-bold text-destructive">{student.conceptsAtRisk}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Última Actividad</p>
                <p className="text-sm font-medium">{student.lastActivity}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Evolución del Dominio (real: dominio acumulado por etapa) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Evolución del Dominio</CardTitle>
            <CardDescription>Dominio acumulado a lo largo de las actividades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evolution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="week" stroke="#6B7280" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E5E7EB",
                      borderRadius: "12px",
                    }}
                  />
                  <Line type="monotone" dataKey="mastery" stroke="#4F46E5" strokeWidth={2} name="Dominio %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {evolTrend != null && evolTrend < 0 && (
              <div className="mt-3 p-3 bg-destructive/5 border border-destructive/20 rounded-[12px]">
                <p className="text-sm text-destructive">
                  <strong>Tendencia negativa:</strong> el dominio cayó {Math.abs(evolTrend)} puntos a
                  lo largo del curso. Se recomienda intervención.
                </p>
              </div>
            )}
            {evolTrend != null && evolTrend > 0 && (
              <div className="mt-3 p-3 bg-success/5 border border-success/20 rounded-[12px]">
                <p className="text-sm text-success">
                  <strong>Tendencia positiva:</strong> el dominio mejoró {evolTrend} puntos a lo largo
                  del curso.
                </p>
              </div>
            )}
            {!evolutionIsReal && (
              <p className="text-xs text-muted-foreground mt-2">
                Mostrando datos de ejemplo (sin secuencia real disponible).
              </p>
            )}
          </CardContent>
        </Card>

        {/* Vista Rápida de Dominio - Radar (real: dominio por sección) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DomainRadar data={radarData} title="Vista Rápida de Dominio" />
          <AttentionHeatmap
            interactions={attentionInteractions}
            currentPrediction={attentionPrediction}
          />
        </div>
        {enabled && attention.isLoading && (
          <p className="text-xs text-muted-foreground -mt-3">Cargando atención del modelo...</p>
        )}
        {!attentionIsReal && (
          <p className="text-xs text-muted-foreground -mt-3">
            {/* TODO backend: sin pesos de atención reales para este estudiante/curso; mostrando ejemplo. */}
            Mapa de atención con datos de ejemplo (sin secuencia real disponible).
          </p>
        )}

        {/* Dominio por Concepto (real: % de acierto por sección del curso) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dominio por Concepto</CardTitle>
            <CardDescription>Tasa de acierto por sección del curso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conceptBars}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="concept" stroke="#6B7280" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E5E7EB",
                      borderRadius: "12px",
                    }}
                  />
                  <Bar dataKey="mastery" fill="#4F46E5" name="Dominio %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Historial de Interacciones (REAL cuando hay estudianteId + curso; mock como fallback) */}
        <StudentInteractionsList interactions={interactionsList} />
        {enabled && interactions.isLoading && (
          <p className="text-xs text-muted-foreground -mt-3">Cargando historial real...</p>
        )}
        {!interactionsAreReal && (
          <p className="text-xs text-muted-foreground -mt-3">
            {/* TODO backend: sin datos reales de interacciones para este estudiante/curso; mostrando ejemplo. */}
            Mostrando datos de ejemplo (sin interacciones reales disponibles).
          </p>
        )}

        {/* Recomendaciones de Intervención (derivadas de las secciones reales) */}
        {recomendaciones && (
          <Card className="bg-warning/5 border-warning/20">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Recomendaciones de Intervención
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recomendaciones.map((r, i) => (
                <div key={r.titulo} className="p-3 bg-background rounded-[12px]">
                  <p className="text-sm font-medium mb-1">{i + 1}. {r.titulo}</p>
                  <p className="text-xs text-muted-foreground">{r.descripcion}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Acciones */}
        <div className="flex gap-2 pt-4 border-t">
          <Button className="flex-1" onClick={onSendFeedback}>
            <MessageSquare className="w-4 h-4 mr-2" />
            Enviar Retroalimentación
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
