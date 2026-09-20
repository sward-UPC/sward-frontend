import { Filter } from 'lucide-react';
import { FORMATO_LABEL, type Formato } from '@features/student/formato';

export type FiltroFormatoValor = Formato | 'todos';

interface FiltroFormatoProps {
  /** Formatos que existen en este curso; los que no hay no se ofrecen. */
  disponibles: Formato[];
  valor: FiltroFormatoValor;
  onChange: (valor: FiltroFormatoValor) => void;
}

/**
 * Filtro por formato de aprendizaje (HU-026): deja ver solo prácticas, quizzes
 * o lecturas. Solo ofrece formatos que el curso tiene, para no llevar al alumno
 * a una lista vacía.
 */
export function FiltroFormato({ disponibles, valor, onChange }: FiltroFormatoProps) {
  if (disponibles.length < 2) return null;
  const opciones: FiltroFormatoValor[] = ['todos', ...disponibles];

  return (
    <div
      className="flex items-center gap-2 flex-wrap"
      role="group"
      aria-label="Filtrar recursos por formato"
    >
      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
        <Filter className="w-4 h-4" aria-hidden="true" />
        Formato:
      </span>
      {opciones.map((op) => {
        const activo = valor === op;
        return (
          <button
            key={op}
            type="button"
            aria-pressed={activo}
            onClick={() => onChange(op)}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer ${
              activo
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background hover:bg-muted/60 border-border'
            }`}
          >
            {op === 'todos' ? 'Todos' : FORMATO_LABEL[op]}
          </button>
        );
      })}
    </div>
  );
}
