import { useRef, useState } from 'react';
import { Bold, Italic, Code, List, Eye, Pencil } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { cn } from '../ui/utils';
import { MiniMarkdown } from './MiniMarkdown';

/**
 * Editor de texto enriquecido ligero: un textarea controlado con barra de formato
 * (negrita/cursiva/código/lista, estilo markdown) y vista previa. Robusto (no usa
 * contentEditable), así que conserva el cursor y funciona al cambiar de ejercicio.
 */
export function RichTextArea({
  value,
  onChange,
  disabled,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);

  /** Envuelve la selección con marcadores markdown (o los inserta en el cursor). */
  function envolver(antes: string, despues = antes) {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const sel = value.slice(start, end) || 'texto';
    const next = value.slice(0, start) + antes + sel + despues + value.slice(end);
    onChange(next);
    // Reposiciona la selección sobre el texto envuelto.
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + antes.length, start + antes.length + sel.length);
    });
  }

  /** Prefija las líneas seleccionadas (para listas). */
  function prefijarLinea(prefijo: string) {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const inicioLinea = value.lastIndexOf('\n', start - 1) + 1;
    const next = value.slice(0, inicioLinea) + prefijo + value.slice(inicioLinea);
    onChange(next);
    requestAnimationFrame(() => el.focus());
  }

  const Btn = ({
    onClick,
    title,
    children,
  }: {
    onClick: () => void;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="w-7 h-7 rounded-[6px] flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40"
    >
      {children}
    </button>
  );

  return (
    <div className={cn('rounded-[10px] border overflow-hidden', disabled && 'opacity-70')}>
      {/* Barra de herramientas */}
      <div className="flex items-center gap-0.5 border-b bg-muted/30 px-1.5 py-1">
        <Btn onClick={() => envolver('**')} title="Negrita">
          <Bold className="w-3.5 h-3.5" />
        </Btn>
        <Btn onClick={() => envolver('*')} title="Cursiva">
          <Italic className="w-3.5 h-3.5" />
        </Btn>
        <Btn onClick={() => envolver('`')} title="Código">
          <Code className="w-3.5 h-3.5" />
        </Btn>
        <Btn onClick={() => prefijarLinea('- ')} title="Lista">
          <List className="w-3.5 h-3.5" />
        </Btn>
        <div className="flex-1" />
        <button
          type="button"
          disabled={disabled}
          onClick={() => setPreview((p) => !p)}
          className="inline-flex items-center gap-1 rounded-[6px] px-2 h-7 text-xs text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40"
        >
          {preview ? <Pencil className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {preview ? 'Editar' : 'Vista previa'}
        </button>
      </div>

      {preview ? (
        <div className="min-h-24 px-3 py-2 text-sm">
          {value.trim() ? (
            <MiniMarkdown text={value} />
          ) : (
            <p className="text-muted-foreground">Nada que previsualizar…</p>
          )}
        </div>
      ) : (
        <Textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-24 border-0 rounded-none focus-visible:ring-0 text-sm resize-y"
        />
      )}
    </div>
  );
}
