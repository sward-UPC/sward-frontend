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
} from 'recharts';
import { TrendingUp, Activity, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import type { StudentTabProps } from '@features/student/useStudentContext';
import { useStudentDetail } from '@features/teacher/hooks/useStudentDetail';

/** Skeleton de carga mientras llega tu data real (o si falta el curso). */
function ProgresoSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-[12px] bg-muted/50" />
        ))}
      </div>
      <div className="h-64 rounded-[12px] bg-muted/50" />
      <div className="h-64 rounded-[12px] bg-muted/50" />
    </div>
  );
}

/** Tab "Tu Progreso" del panel del estudiante. SOLO datos reales (ms-trazabilidad). */
export function StudentProgresoTab({ estudianteId, courseId }: StudentTabProps) {
  const { enabled, progress, interactions, conceptMastery, weeklyProgress } = useStudentDetail(
    estudianteId,
    courseId,
  );

  // Sin curso seleccionado todavía → skeleton (las queries no corren).
  if (!courseId) {
    return <ProgresoSkeleton />;
  }

  const isLoading =
    progress.isLoading ||
    interactions.isLoading ||
    conceptMastery.isLoading ||
    weeklyProgress.isLoading;

  // Dominio por concepto/sección (mismo shape que StudentDetailView).
  const conceptos = enabled ? (conceptMastery.data ?? []) : [];
  // Evolución del dominio por etapa: keys `week` y `mastery`.
  const evolution = enabled ? (weeklyProgress.data ?? []) : [];
  const interaccionesTotal = enabled ? (interactions.data?.length ?? 0) : 0;

  if (isLoading) {
    return <ProgresoSkeleton />;
  }

  // Estado vacío: no hay nada de seguimiento todavía.
  const sinDatos =
    !enabled || (conceptos.length === 0 && evolution.length === 0 && interaccionesTotal === 0);
  if (sinDatos) {
    return (
      <div className="flex items-start gap-3 p-4 bg-muted/30 border border-border rounded-[12px]">
        <AlertTriangle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          Todavía no tenemos datos de tu progreso en este curso. A medida que interactúes con las
          actividades, aquí verás tu evolución y tu dominio por concepto.
        </p>
      </div>
    );
  }

  // KPIs reales.
  const promedioConceptos =
    conceptos.length > 0
      ? Math.round(conceptos.reduce((acc, c) => acc + c.dominio, 0) / conceptos.length)
      : 0;
  const dominioPromedio = progress.data?.puntajePromedio ?? promedioConceptos;
  const conceptosDominados = conceptos.filter((c) => c.dominio >= 75).length;
  const conceptosEnRiesgo = conceptos.filter((c) => c.dominio < 55).length;

  // Datos para los charts (mismos keys que StudentDetailView).
  const conceptBars = conceptos.map((c) => ({ concept: c.concepto, mastery: c.dominio }));

  return (
    <div className="space-y-6">
      {/* Franja de KPIs reales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <TrendingUp className="w-5 h-5 mx-auto mb-1 text-primary" />
              <p className="text-sm text-muted-foreground mb-1">Dominio promedio</p>
              <p className="text-2xl font-bold">{dominioPromedio}%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Activity className="w-5 h-5 mx-auto mb-1 text-primary" />
              <p className="text-sm text-muted-foreground mb-1">Interacciones</p>
              <p className="text-2xl font-bold">{interaccionesTotal}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-success" />
              <p className="text-sm text-muted-foreground mb-1">Conceptos dominados</p>
              <p className="text-2xl font-bold text-success">{conceptosDominados}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-destructive" />
              <p className="text-sm text-muted-foreground mb-1">En riesgo</p>
              <p className="text-2xl font-bold text-destructive">{conceptosEnRiesgo}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Evolución de tu Dominio */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Evolución de tu Dominio</CardTitle>
          <CardDescription>Tu dominio acumulado a lo largo de las actividades</CardDescription>
        </CardHeader>
        <CardContent>
          {evolution.length >= 2 ? (
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evolution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="week" stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '12px',
                    }}
                  />
                  <Line type="monotone" dataKey="mastery" stroke="#4F46E5" strokeWidth={2} name="Dominio %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Aún no hay suficientes etapas para dibujar tu curva de evolución. Sigue resolviendo
              actividades y pronto verás cómo avanza tu dominio.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Dominio por Concepto */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dominio por Concepto</CardTitle>
          <CardDescription>Tu tasa de acierto por sección del curso</CardDescription>
        </CardHeader>
        <CardContent>
          {conceptBars.length > 0 ? (
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conceptBars}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="concept" stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '12px',
                    }}
                  />
                  <Bar dataKey="mastery" fill="#4F46E5" name="Dominio %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Todavía no tienes dominio registrado por concepto en este curso.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
