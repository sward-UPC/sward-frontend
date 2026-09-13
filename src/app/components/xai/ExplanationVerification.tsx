import type { ReactNode } from 'react';
import { ArrowLeftRight, Hourglass, ShieldCheck, ShieldQuestion } from 'lucide-react';
import type { ExplanationVerification as Verification } from '@core/types/xai.types';

export type VerificationAudience = 'student' | 'teacher';

interface ExplanationVerificationProps {
  verification: Verification | null;
  /** Estudiante: segunda persona. Docente: tercera persona. */
  audience?: VerificationAudience;
}

/** "A", "A y B", "A, B y C". */
function joinConcepts(concepts: string[]): string {
  if (concepts.length <= 1) return concepts[0] ?? '';
  return `${concepts.slice(0, -1).join(', ')} y ${concepts[concepts.length - 1]}`;
}

const pct = (p: number) => `${Math.round(p * 100)}%`;

function Panel({
  icon,
  title,
  tone,
  children,
}: {
  icon: ReactNode;
  title: string;
  tone: 'verified' | 'unverified' | 'pending';
  children: ReactNode;
}) {
  const tones = {
    verified: { box: 'bg-success/5 border-success/25', icon: 'bg-success/15 text-success' },
    unverified: { box: 'bg-muted/40 border-border', icon: 'bg-muted text-muted-foreground' },
    pending: { box: 'bg-primary/5 border-primary/20', icon: 'bg-primary/10 text-primary' },
  };
  return (
    <div
      className={`flex items-start gap-3 p-4 border rounded-[12px] ${tones[tone].box}`}
      role="status"
      aria-live="polite"
    >
      <div className={`shrink-0 rounded-[12px] p-2 ${tones[tone].icon}`} aria-hidden="true">
        {icon}
      </div>
      <div className="space-y-1.5 text-sm min-w-0">
        <p className="font-medium text-foreground">{title}</p>
        {children}
      </div>
    </div>
  );
}

/**
 * Qué se puede afirmar sobre la explicación, según lo que el backend verificó.
 *
 * La atención del SAKT, medida con ERASER, resultó suficiente pero no necesaria:
 * las interacciones más atendidas bastan para llegar a la predicción, pero no son
 * su causa. Por eso este componente nunca dice «se debe a» ni «influye»: afirma
 * suficiencia solo cuando se verificó, ofrece el contrafactual solo cuando además
 * se verificó necesidad, y cuando no hay verificación lo dice.
 *
 * Con la verificación desactivada no muestra nada: esa es la condición de control
 * para comparar la interfaz con y sin verificación en la validación con usuarios.
 */
export function ExplanationVerification({
  verification: v,
  audience = 'student',
}: ExplanationVerificationProps) {
  if (!v || v.reason === 'verificacion_desactivada') return null;

  const student = audience === 'student';

  if (v.reason === 'pocas_interacciones') {
    return (
      <Panel icon={<Hourglass className="w-5 h-5" />} title="Aún no se puede verificar" tone="pending">
        <p className="text-muted-foreground">
          {student
            ? 'Todavía hay pocas interacciones para comprobar qué explica esta predicción. Sigue resolviendo actividades y lo verificaremos.'
            : 'El estudiante tiene aún pocas interacciones para comprobar qué explica esta predicción.'}
        </p>
      </Panel>
    );
  }

  if (!v.verified || v.sufficientConcepts.length === 0) {
    const error = v.reason === 'error_verificacion';
    return (
      <Panel
        icon={<ShieldQuestion className="w-5 h-5" />}
        title={error ? 'No se pudo verificar la explicación' : 'Explicación no verificada'}
        tone="unverified"
      >
        <p className="text-muted-foreground">
          {error
            ? 'La comprobación falló en este momento. '
            : `Para ${student ? 'tu' : 'su'} historial actual no pudimos comprobar que las interacciones más atendidas basten para explicar esta predicción. `}
          El mapa muestra dónde se fijó el modelo, pero no debe leerse como la razón de la
          recomendación.
        </p>
      </Panel>
    );
  }

  const concepts = joinConcepts(v.sufficientConcepts);
  const plural = v.sufficientConcepts.length > 1;
  const won = Math.round(v.confidence * v.comparisons);
  const cf = v.isNecessary ? v.counterfactual : null;

  return (
    <Panel icon={<ShieldCheck className="w-5 h-5" />} title="Explicación verificada" tone="verified">
      <p className="text-foreground">
        {student ? (plural ? 'Tus resultados' : 'Tu resultado') : plural ? 'Sus resultados' : 'Su resultado'}{' '}
        en <strong>{concepts}</strong> {plural ? 'bastan' : 'basta'} por sí{' '}
        {plural ? 'solos' : 'solo'} para que el modelo llegue a esta misma predicción.
      </p>
      <p className="text-xs text-muted-foreground">
        Lo comprobamos sobre {student ? 'tu' : 'este'} historial: explicó la predicción mejor
        que {won} de {v.comparisons} interacciones elegidas al azar.
      </p>
      {!v.isNecessary && (
        <p className="text-xs text-muted-foreground">
          Bastar no es lo mismo que causar: {student ? 'tu' : 'su'} historial tiene más
          evidencia que apunta a lo mismo.
        </p>
      )}
      {cf && (
        <p className="flex items-start gap-1.5 text-foreground pt-1">
          <ArrowLeftRight className="w-4 h-4 mt-0.5 shrink-0 text-success" aria-hidden="true" />
          <span>
            Y además pesa de verdad: si {student ? 'hubieras' : 'hubiera'}{' '}
            {cf.originallyCorrect ? 'fallado' : 'acertado'} en <strong>{cf.concept}</strong>, la
            probabilidad de acertar el próximo ejercicio pasaría de {pct(cf.probabilityBefore)} a{' '}
            {pct(cf.probabilityAfter)}.
          </span>
        </p>
      )}
    </Panel>
  );
}
