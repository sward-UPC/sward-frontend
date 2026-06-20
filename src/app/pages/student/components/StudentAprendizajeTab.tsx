import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { AlertTriangle, TrendingUp, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { DomainRadar } from '../../../components/xai/DomainRadar';
import { useStudentDetail } from '@features/teacher/hooks/useStudentDetail';
import type { StudentTabProps } from '@features/student/useStudentContext';

/** Esqueleto mientras cargan los datos reales (o falta el curso). */
function AprendizajeSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-72 rounded-[12px] bg-muted/50" />
        <div className="h-72 rounded-[12px] bg-muted/50" />
      </div>
      <div className="h-64 rounded-[12px] bg-muted/50" />
    </div>
  );
}

/**
 * Tab "Mi Aprendizaje" del panel del estudiante. Muestra, en segunda persona y
 * SOLO con datos reales (ms-trazabilidad), el dominio del alumno por concepto:
 * radar, barras y una lectura textual XAI de fortalezas y puntos a reforzar.
 */
export function StudentAprendizajeTab({ estudianteId, courseId }: StudentTabProps) {
  const { enabled, conceptMastery } = useStudentDetail(estudianteId, courseId);

  // Mientras no haya curso o los conceptos sigan cargando: esqueleto.
  if (!enabled || conceptMastery.isLoading) {
    return <AprendizajeSkeleton />;
  }

  // Error de backend: nunca mostramos datos ficticios.
  if (conceptMastery.isError) {
    return (
      <div className="flex items-start gap-3 p-4 bg-destructive/5 border border-destructive/20 rounded-[12px]">
        <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
        <p className="text-sm text-destructive">
          <strong>No pudimos cargar tu aprendizaje.</strong> Hubo un error al contactar al
          servidor. Vuelve a intentarlo más tarde.
        </p>
      </div>
    );
  }

  const conceptos = conceptMastery.data ?? [];

  // Estado vacío: el alumno aún no tiene interacciones registradas en el curso.
  if (conceptos.length === 0) {
    return (
      <div className="flex items-start gap-3 p-4 bg-muted/40 border border-border rounded-[12px]">
        <Target className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          Todavía no tenemos datos de tu dominio en este curso. A medida que vayas resolviendo
          actividades, aquí verás cómo evoluciona tu aprendizaje por concepto.
        </p>
      </div>
    );
  }

  // Radar + barras: dominio por concepto/sección.
  const radarData = conceptos.map((c) => ({ subject: c.concepto, value: c.dominio, fullMark: 100 }));
  const conceptBars = conceptos.map((c) => ({ concept: c.concepto, mastery: c.dominio }));

  // Lectura XAI textual: fortalezas (>=75) y a reforzar (<55).
  const fortalezas = conceptos.filter((c) => c.dominio >= 75);
  const aReforzar = conceptos.filter((c) => c.dominio < 55);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Radar: dominio por concepto (anima de vacío→real). */}
        <DomainRadar
          key={`radar-${radarData.length}`}
          data={radarData}
          title="Vista de tu dominio"
        />

        {/* Dominio por Concepto: barras 0-100. */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dominio por Concepto</CardTitle>
            <CardDescription>Tu tasa de acierto por sección del curso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
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
          </CardContent>
        </Card>
      </div>

      {/* Bloque XAI textual: ¿Cómo vas? */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">¿Cómo vas?</CardTitle>
          <CardDescription>Una lectura rápida de tus conceptos fuertes y los que conviene reforzar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tus fortalezas (dominio >= 75) */}
            <div className="p-4 bg-success/5 border border-success/20 rounded-[12px]">
              <p className="flex items-center gap-2 text-sm font-semibold text-success mb-3">
                <TrendingUp className="w-4 h-4" />
                Tus fortalezas
              </p>
              {fortalezas.length > 0 ? (
                <ul className="space-y-2">
                  {fortalezas.map((c) => (
                    <li key={c.concepto} className="flex items-center justify-between text-sm">
                      <span className="text-foreground truncate mr-2">{c.concepto}</span>
                      <span className="font-semibold text-success shrink-0">{c.dominio}%</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Aún no consolidás ningún concepto al 75%. ¡Vas en camino, seguí practicando!
                </p>
              )}
            </div>

            {/* A reforzar (dominio < 55) */}
            <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-[12px]">
              <p className="flex items-center gap-2 text-sm font-semibold text-destructive mb-3">
                <AlertTriangle className="w-4 h-4" />
                A reforzar
              </p>
              {aReforzar.length > 0 ? (
                <ul className="space-y-2">
                  {aReforzar.map((c) => (
                    <li key={c.concepto} className="flex items-center justify-between text-sm">
                      <span className="text-foreground truncate mr-2">{c.concepto}</span>
                      <span className="font-semibold text-destructive shrink-0">{c.dominio}%</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No tenés conceptos por debajo del 55%. ¡Buen trabajo manteniendo el ritmo!
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
