import { useRef, useEffect } from 'react';
import { Bold, Italic, Code, List } from 'lucide-react';
import { cn } from '../ui/utils';

/**
 * Editor WYSIWYG ligero (contentEditable): clic en Negrita pone el texto en negrita
 * de verdad (no inserta markdown). Reporta el HTML y el texto plano. Es NO controlado
 * (se inicializa una vez con `initialHtml`); usa `key` en el padre para reiniciarlo al
 * cambiar de ejercicio y así evitar saltos de cursor.
 */
export function RichTextEditor({
  initialHtml,
  onChange,
  disabled,
  placeholder,
}: {
  initialHtml: string;
  onChange: (html: string, text: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Setea el contenido inicial UNA sola vez (imperativo). NO usamos
  // dangerouslySetInnerHTML porque React lo re-aplicaría en cada render → el cursor
  // saltaba al inicio al escribir. Con `key={paso}` el padre lo remonta por ejercicio.
  useEffect(() => {
    if (ref.current && initialHtml) ref.current.innerHTML = initialHtml;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function emit() {
    const el = ref.current;
    if (el) onChange(el.innerHTML, el.innerText);
  }

  function exec(command: string) {
    if (disabled) return;
    ref.current?.focus();
    document.execCommand(command, false);
    emit();
  }

  function wrapCode() {
    if (disabled) return;
    const sel = window.getSelection();
    const texto = sel?.toString();
    ref.current?.focus();
    if (texto) {
      const escapado = texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      document.execCommand('insertHTML', false, `<code>${escapado}</code>&nbsp;`);
    }
    emit();
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
      <div className="flex items-center gap-0.5 border-b bg-muted/30 px-1.5 py-1">
        <Btn onClick={() => exec('bold')} title="Negrita">
          <Bold className="w-3.5 h-3.5" />
        </Btn>
        <Btn onClick={() => exec('italic')} title="Cursiva">
          <Italic className="w-3.5 h-3.5" />
        </Btn>
        <Btn onClick={wrapCode} title="Código">
          <Code className="w-3.5 h-3.5" />
        </Btn>
        <Btn onClick={() => exec('insertUnorderedList')} title="Lista">
          <List className="w-3.5 h-3.5" />
        </Btn>
      </div>
      <div
        ref={ref}
        contentEditable={!disabled}
        suppressContentEditableWarning
        onInput={emit}
        data-placeholder={placeholder}
        role="textbox"
        aria-multiline="true"
        className={cn(
          'min-h-24 max-h-72 overflow-y-auto px-3 py-2 text-sm outline-none',
          '[&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[0.85em] [&_code]:font-mono',
          '[&_ul]:list-disc [&_ul]:ml-5 [&_ul]:my-1 [&_b]:font-semibold [&_strong]:font-semibold',
          'empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground empty:before:pointer-events-none',
        )}
      />
    </div>
  );
}
