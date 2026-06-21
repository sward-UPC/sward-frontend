import { AlertTriangle, TrendingUp, Target, Sparkles, ListChecks } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { Progress } from '../../../components/ui/progress';
import { DomainRadar } from '../../../components/xai/DomainRadar';
import { useStudentDetail } from '@features/teacher/hooks/useStudentDetail';
import type { StudentTabProps } from '@features/student/useStudentContext';

interface ConceptMasteryItem {
  concepto: string;
  dominio: number;
  total: number;
}

/** Umbrales de dominio compartidos por todo el tab (mismos cortes que el radar). */
const FUERTE = 75;
const A_REFORZAR = 55;

/** Esqueleto mientras cargan los datos reales (o falta el curso). */
function AprendizajeSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-24 rounded-[12px] bg-muted/50" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-80 rounded-[12px] bg-muted/50" />
        <div className="h-80 rounded-[12px] bg-muted/50" />
      </div>
      <div className="h-64 rounded-[12px] bg-muted/50" />
    </div>
  );
}

/** Chip de ícono consistente con el resto del panel. */
function IconChip({
  accent,
  children,
}: {
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`shrink-0 rounded-[12px] p-2 ${accent}`}>{children}</div>
  );
}

/**
 * Cabecera-foco: la lectura de un vistazo. Concentra el peso visual del tab
 * (dominio promedio grande) y resume cuántos conceptos van fuertes / a reforzar,
 * acompañando el color SIEMPRE con número y texto.
 */
function ResumenAprendizaje({
  promedio,
  fuertes,
  reforzar,
  totalConceptos,
}: {
  promedio: number;
  fuertes: number;
  reforzar: number;
  totalConceptos: number;
}) {
  return (
    <Card className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300 motion-reduce:animate-none">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Foco: dominio promedio */}
          <div className="flex items-center gap-4">
            <IconChip accent="bg-primary/10 text-primary">
              <Target className="w-6 h-6" aria-hidden="true" />
            </IconChip>
            <div>
              <p className="text-sm text-muted-foreground">Tu dominio promedio</p>
              <p className="text-4xl font-bold leading-tight tracking-tight">{promedio}%</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {promedio >= 70
                  ? '¡Vas muy bien! Mantén el ritmo.'
                  : 'Cada repaso suma, tú puedes.'}
              </p>
            </div>
          </div>

          {/* Apoyo: distribución fuertes / a reforzar */}
          <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:text-right">
            <div className="flex items-center gap-2 sm:flex-row-reverse">
              <IconChip accent="bg-success/10 text-success">
                <TrendingUp className="w-4 h-4" aria-hidden="true" />
              </IconChip>
              <div>
                <p className="text-2xl font-bold leading-tight text-success">{fuertes}</p>
                <p className="text-xs text-muted-foreground">
                  {fuertes === 1 ? 'concepto fuerte' : 'conceptos fuertes'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:flex-row-reverse">
              <IconChip
                accent={
                  reforzar === 0
                    ? 'bg-success/10 text-success'
                    : 'bg-warning/10 text-warning'
                }
              >
                <AlertTriangle className="w-4 h-4" aria-hidden="true" />
              </IconChip>
              <div>
                <p
                  className={`text-2xl font-bold leading-tight ${
                    reforzar === 0 ? 'text-success' : 'text-warning'
                  }`}
                >
                  {reforzar}
                </p>
                <p className="text-xs text-muted-foreground">
                  {reforzar === 1 ? 'a reforzar' : 'a reforzar'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="sr-only">
          Tienes {totalConceptos} conceptos en seguimiento: {fuertes} fuertes y {reforzar} a
          reforzar.
        </p>
      </CardContent>
    </Card>
  );
}

/**
 * Lista ordenada de dominio por concepto con barra de progreso. Reemplaza al
 * gráfico de barras (redundante con el radar) por una vista accionable: ordena
 * del más flojo al más fuerte para que el foco caiga en lo que conviene repasar.
 */
function DominioPorConcepto({ conceptos }: { conceptos: ConceptMasteryItem[] }) {
  const ordenados = [...conceptos].sort((a, b) => a.dominio - b.dominio);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <ListChecks className="w-5 h-5 text-primary" aria-hidden="true" />
          Dominio por concepto
        </CardTitle>
        <CardDescription>Ordenado del que más conviene repasar al más sólido</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {ordenados.map((c) => {
          const tono =
            c.dominio >= FUERTE
              ? 'text-success'
              : c.dominio < A_REFORZAR
              ? 'text-warning'
              : 'text-muted-foreground';
          return (
            <div key={c.concepto} className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium truncate">{c.concepto}</span>
                <span className={`text-sm font-semibold shrink-0 ${tono}`}>{c.dominio}%</span>
              </div>
              <Progress
                value={c.dominio}
                aria-label={`Dominio de ${c.concepto}: ${c.dominio} por ciento`}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

/** Columna de la lectura XAI: fortalezas o conceptos a reforzar. */
function ListaXai({
  variant,
  conceptos,
  vacioMsg,
}: {
  variant: 'fortaleza' | 'reforzar';
  conceptos: ConceptMasteryItem[];
  vacioMsg: string;
}) {
  const esFortaleza = variant === 'fortaleza';
  const accent = esFortaleza
    ? 'bg-success/10 text-success'
    : 'bg-warning/10 text-warning';
  const valueColor = esFortaleza ? 'text-success' : 'text-warning';

  return (
    <div className="rounded-[12px] border p-4 bg-muted/30">
      <div className="flex items-center gap-2 mb-3">
        <IconChip accent={accent}>
          {esFortaleza ? (
            <TrendingUp className="w-4 h-4" aria-hidden="true" />
          ) : (
            <AlertTriangle className="w-4 h-4" aria-hidden="true" />
          )}
        </IconChip>
        <p className="text-sm font-semibold">
          {esFortaleza ? 'Tus fortalezas' : 'A reforzar'}
        </p>
      </div>
      {conceptos.length > 0 ? (
        <ul className="space-y-2">
          {conceptos.map((c) => (
            <li
              key={c.concepto}
              className="flex items-center justify-between gap-2 text-sm"
            >
              <span className="text-foreground truncate">{c.concepto}</span>
              <span className={`font-semibold shrink-0 ${valueColor}`}>{c.dominio}%</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">{vacioMsg}</p>
      )}
    </div>
  );
}

/**
 * Tab "Mi Aprendizaje" del panel del estudiante. Muestra, en segunda persona y
 * SOLO con datos reales (ms-trazabilidad), el dominio del alumno por concepto:
 * un resumen de un vistazo, el radar, una lista accionable y una lectura
 * textual XAI de fortalezas y puntos a reforzar.
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
      <div className="flex items-start gap-3 p-4 bg-destructive/5 border border-destructive/20 rounded-[12px] animate-in fade-in-50 duration-300 motion-reduce:animate-none">
        <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm text-destructive">
          <strong>No pudimos cargar tu aprendizaje.</strong> Hubo un error al contactar al
          servidor. Vuelve a intentarlo más tarde.
        </p>
      </div>
    );
  }

  const conceptos: ConceptMasteryItem[] = conceptMastery.data ?? [];

  // Estado vacío: el alumno aún no tiene interacciones registradas en el curso.
  if (conceptos.length === 0) {
    return (
      <Card className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300 motion-reduce:animate-none">
        <CardContent className="pt-10 pb-10">
          <div className="flex flex-col items-center text-center gap-3">
            <IconChip accent="bg-primary/10 text-primary">
              <Sparkles className="w-6 h-6" aria-hidden="true" />
            </IconChip>
            <p className="text-base font-medium">Todavía no tenemos datos de tu dominio</p>
            <p className="text-sm text-muted-foreground max-w-md">
              A medida que vayas resolviendo actividades del curso, aquí verás cómo evoluciona tu
              aprendizaje por concepto. ¡Anímate a comenzar!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Radar: dominio por concepto/sección.
  const radarData = conceptos.map((c) => ({
    subject: c.concepto,
    value: c.dominio,
    fullMark: 100,
  }));

  // Resumen de un vistazo + lectura XAI.
  const promedio = Math.round(
    conceptos.reduce((acc, c) => acc + c.dominio, 0) / conceptos.length,
  );
  const fortalezas = conceptos.filter((c) => c.dominio >= FUERTE);
  const aReforzar = conceptos.filter((c) => c.dominio < A_REFORZAR);

  return (
    <div className="space-y-6">
      {/* Foco del tab: resumen de un vistazo */}
      <ResumenAprendizaje
        promedio={promedio}
        fuertes={fortalezas.length}
        reforzar={aReforzar.length}
        totalConceptos={conceptos.length}
      />

      {/* Detalle: radar (vista global) + lista accionable por concepto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-300 [animation-delay:75ms] motion-reduce:animate-none">
        <DomainRadar
          key={`radar-${radarData.length}`}
          data={radarData}
          title="Vista de tu dominio"
        />
        <DominioPorConcepto conceptos={conceptos} />
      </div>

      {/* Lectura XAI: fortalezas y conceptos a reforzar */}
      <Card className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300 [animation-delay:150ms] motion-reduce:animate-none">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" aria-hidden="true" />
            ¿Cómo vas?
          </CardTitle>
          <CardDescription>
            Una lectura rápida de tus conceptos fuertes y los que conviene reforzar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ListaXai
              variant="fortaleza"
              conceptos={fortalezas}
              vacioMsg="Aún no consolidas ningún concepto al 75%. ¡Vas en camino, sigue practicando!"
            />
            <ListaXai
              variant="reforzar"
              conceptos={aReforzar}
              vacioMsg="No tienes conceptos por debajo del 55%. ¡Buen trabajo manteniendo el ritmo!"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
