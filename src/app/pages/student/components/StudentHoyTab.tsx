import { useSearchParams } from 'react-router';
import type { StudentTabProps } from '@features/student/useStudentContext';
import { useStudentDetail } from '@features/teacher/hooks/useStudentDetail';
import { DomainRadar } from '../../../components/xai/DomainRadar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Progress } from '../../../components/ui/progress';
import { Sparkles, TrendingUp, BookOpen, Target, Activity, ArrowRight, ChevronRight, Flame, Route } from 'lucide-react';
import { calcularRuta } from '@features/student/gamification';
import { useStudentStreak } from '@features/student/useStudentStreak';

interface ConceptMasteryItem {
  concepto: string;
  dominio: number;
  total: number;
}

/**
 * Fila de gamificación: racha de días consecutivos con actividad y progreso de
 * la ruta de aprendizaje. Ambos valores son REALES (calculados de interacciones
 * y dominio por concepto).
 */
function GamificacionRow({
  racha,
  ruta,
}: {
  racha: number;
  ruta: { completados: number; total: number };
}) {
  const rutaPct = ruta.total > 0 ? Math.round((ruta.completados / ruta.total) * 100) : 0;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Racha */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-3">
            <div className="shrink-0 rounded-[12px] p-2 bg-warning/10 text-warning">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              {racha > 0 ? (
                <>
                  <p className="text-2xl font-bold leading-tight">
                    {racha} {racha === 1 ? 'día' : 'días'} de racha
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    ¡Sigue conectándote para no romperla!
                  </p>
                </>
              ) : (
                <>
                  <p className="text-lg font-semibold leading-tight">¡Empieza tu racha hoy!</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Resuelve una actividad para encender la llama 🔥
                  </p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ruta de aprendizaje */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-3">
            <div className="shrink-0 rounded-[12px] p-2 bg-primary/10 text-primary">
              <Route className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-2xl font-bold leading-tight">
                Ruta de aprendizaje {ruta.completados}/{ruta.total}
              </p>
              <Progress value={rutaPct} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {ruta.completados >= ruta.total
                  ? '¡Ruta completada, excelente!'
                  : `${ruta.total - ruta.completados} ${
                      ruta.total - ruta.completados === 1 ? 'paso' : 'pasos'
                    } para completarla`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/** Una tarjeta de KPI con su valor real y un subtítulo motivador. */
function KpiCard({
  icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
  accent?: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className={`shrink-0 rounded-[12px] p-2 ${accent ?? 'bg-primary/10 text-primary'}`}>
            {icon}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Tab "Hoy" del panel del estudiante: un resumen motivador con SUS datos reales
 * (dominio, conceptos por reforzar e interacciones) traídos de ms-trazabilidad.
 */
export function StudentHoyTab({ estudianteId, courseId, courseName }: StudentTabProps) {
  // Misma fuente real que usa el panel docente, pero pidiendo MI propia data.
  const { enabled, progress, interactions, conceptMastery } = useStudentDetail(estudianteId, courseId);

  // Racha GLOBAL (todos los cursos): el mismo número en cualquier curso, no por curso.
  const { data: rachaGlobal } = useStudentStreak(estudianteId);

  // Navegación a la pestaña Recursos (preservando el curso seleccionado en la URL).
  const [searchParams, setSearchParams] = useSearchParams();
  const irARecursos = () => {
    const next = new URLSearchParams(searchParams);
    next.set('nav', 'recursos');
    setSearchParams(next);
  };

  // Mientras no haya curso o sigan cargando los conceptos → skeleton.
  const isLoading = !courseId || conceptMastery.isLoading;
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-24 rounded-[12px] bg-muted/50" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-28 rounded-[12px] bg-muted/50" />
          <div className="h-28 rounded-[12px] bg-muted/50" />
          <div className="h-28 rounded-[12px] bg-muted/50" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-72 rounded-[12px] bg-muted/50" />
          <div className="h-72 rounded-[12px] bg-muted/50" />
        </div>
      </div>
    );
  }

  const cm: ConceptMasteryItem[] = enabled ? (conceptMastery.data ?? []) : [];

  // Estado vacío amable: el alumno aún no tiene seguimiento real en este curso.
  if (cm.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">¡Hola! 👋</h2>
        </div>
        {courseName && (
          <p className="text-sm text-muted-foreground">
            Estás en <strong>{courseName}</strong>.
          </p>
        )}
        <Card>
          <CardContent className="pt-10 pb-10">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="rounded-full bg-primary/10 text-primary p-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="text-base font-medium">Todavía no tenemos datos tuyos por aquí</p>
              <p className="text-sm text-muted-foreground max-w-md">
                En cuanto empieces a resolver actividades del curso, verás tu dominio por sección,
                qué reforzar y tus interacciones. ¡Anímate a comenzar!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // KPI 1 — Dominio promedio: puntaje real si existe, si no promedio del radar.
  const avgFromConcepts = Math.round(cm.reduce((acc, c) => acc + c.dominio, 0) / cm.length);
  const avgMastery = progress.data?.puntajePromedio ?? avgFromConcepts;

  // KPI 2 — Por reforzar: conceptos con dominio bajo.
  const weak = cm.filter((c) => c.dominio < 60).sort((a, b) => a.dominio - b.dominio);
  const porReforzar = weak.length;

  // KPI 3 — Interacciones registradas.
  const totalInteractions = interactions.data?.length ?? 0;

  // Radar con MI dominio por sección.
  const radarData = cm.map((c) => ({ subject: c.concepto, value: c.dominio, fullMark: 100 }));

  // "Lo próximo para ti": 1-2 secciones más flojas (o las de menor dominio).
  const proximas = (weak.length > 0 ? weak : [...cm].sort((a, b) => a.dominio - b.dominio)).slice(0, 2);

  // Gamificación REAL: racha GLOBAL (del backend, todos los cursos) y ruta (conceptos dominados del curso).
  const racha = rachaGlobal ?? 0;
  const ruta = calcularRuta(cm);

  return (
    <div className="space-y-6">
      {/* Saludo + contexto del curso */}
      <div>
        <h2 className="text-xl font-semibold">¡Hola! 👋</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {courseName ? (
            <>Este es tu resumen de hoy en <strong>{courseName}</strong>. Sigue así.</>
          ) : (
            <>Este es tu resumen de hoy. Sigue así.</>
          )}
        </p>
      </div>

      {/* Gamificación: racha + ruta de aprendizaje (data real) */}
      <GamificacionRow racha={racha} ruta={ruta} />

      {/* Franja de 3 KPIs reales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard
          icon={<Target className="w-5 h-5" />}
          label="Dominio promedio"
          value={`${avgMastery}%`}
          hint={avgMastery >= 70 ? '¡Vas muy bien!' : 'Cada paso suma, tú puedes'}
          accent="bg-primary/10 text-primary"
        />
        <KpiCard
          icon={<BookOpen className="w-5 h-5" />}
          label="Por reforzar"
          value={`${porReforzar}`}
          hint={
            porReforzar === 0
              ? 'Nada pendiente, ¡genial!'
              : `Sección${porReforzar === 1 ? '' : 'es'} para darle un repaso`
          }
          accent={porReforzar === 0 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}
        />
        <KpiCard
          icon={<Activity className="w-5 h-5" />}
          label="Interacciones"
          value={`${totalInteractions}`}
          hint="Tu actividad en el curso"
          accent="bg-primary/10 text-primary"
        />
      </div>

      {/* Grid 2 columnas: radar + "Lo próximo para ti" */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DomainRadar
          key={`radar-hoy-${radarData.length}`}
          data={radarData}
          title="Tu dominio por sección"
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Lo próximo para ti
            </CardTitle>
            <CardDescription>
              {porReforzar > 0
                ? 'Estas secciones son tu mejor oportunidad de mejora.'
                : 'Mantén el ritmo y refuerza con retos avanzados.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {proximas.map((c, i) => (
              <button
                key={c.concepto}
                type="button"
                onClick={irARecursos}
                title="Ir a Recursos para reforzar este tema"
                className="w-full text-left p-3 bg-muted/40 rounded-[12px] border border-transparent hover:border-primary/40 hover:bg-muted/60 transition-colors group"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-sm font-medium flex items-center gap-1">
                    {i + 1}. {c.concepto}
                  </p>
                  <span className="flex items-center gap-1 shrink-0">
                    <span
                      className={`text-xs font-semibold ${
                        c.dominio < 60 ? 'text-warning' : 'text-success'
                      }`}
                    >
                      {c.dominio}%
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {c.dominio < 40
                    ? 'Conviene empezar por aquí: un poco de repaso te dará un gran salto.'
                    : c.dominio < 60
                    ? 'Estás cerca: con un repaso más lo dominas.'
                    : '¡Buen nivel! Refuérzalo para que quede sólido.'}
                </p>
              </button>
            ))}

            <button
              type="button"
              onClick={irARecursos}
              className="w-full flex items-center justify-center gap-2 pt-1 pb-0.5 text-sm text-primary font-medium hover:underline"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Ve a la pestaña Recursos para practicar estos temas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
