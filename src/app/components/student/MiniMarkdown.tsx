import { Fragment, type ReactNode } from 'react';

/**
 * Renderizador de markdown mínimo y seguro (sin dependencias ni HTML crudo):
 * soporta **negrita**, *cursiva*, `código`, bloques ```código```, listas con "- "
 * y saltos de línea. Pensado para mostrar respuestas/soluciones/feedback con formato.
 */
export function MiniMarkdown({
  text,
  className,
  inline: soloInline,
}: {
  text: string;
  className?: string;
  /** Solo formato inline (negrita/cursiva/código) en un <span>, sin párrafos ni listas. */
  inline?: boolean;
}) {
  if (soloInline) {
    return <span className={className}>{inline(text)}</span>;
  }
  const bloques = text.split(/```/);
  return (
    <div className={className}>
      {bloques.map((bloque, i) => {
        // Índices impares = dentro de ``` ``` → bloque de código.
        if (i % 2 === 1) {
          return (
            <pre
              key={i}
              className="my-2 overflow-x-auto rounded-[8px] bg-muted px-3 py-2 text-xs font-mono leading-relaxed"
            >
              <code>{bloque.replace(/^\n/, '').replace(/\n$/, '')}</code>
            </pre>
          );
        }
        return <Fragment key={i}>{renderParrafos(bloque)}</Fragment>;
      })}
    </div>
  );
}

/** Agrupa líneas en párrafos y listas (con "- "). */
function renderParrafos(texto: string): ReactNode {
  const lineas = texto.split('\n');
  const out: ReactNode[] = [];
  let lista: string[] = [];

  const volcarLista = (key: string) => {
    if (lista.length === 0) return;
    out.push(
      <ul key={key} className="my-1.5 ml-4 list-disc space-y-0.5">
        {lista.map((li, j) => (
          <li key={j}>{inline(li)}</li>
        ))}
      </ul>,
    );
    lista = [];
  };

  lineas.forEach((linea, i) => {
    const m = linea.match(/^\s*[-*]\s+(.*)/);
    if (m) {
      lista.push(m[1]);
      return;
    }
    volcarLista(`ul-${i}`);
    if (linea.trim()) {
      out.push(
        <p key={`p-${i}`} className="my-1 leading-relaxed">
          {inline(linea)}
        </p>,
      );
    }
  });
  volcarLista('ul-fin');
  return out;
}

/** Formato inline: **negrita**, *cursiva*, `código`. */
function inline(texto: string): ReactNode {
  const partes = texto.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);
  return partes.map((parte, i) => {
    if (parte.startsWith('**') && parte.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold">
          {parte.slice(2, -2)}
        </strong>
      );
    }
    if (parte.startsWith('`') && parte.endsWith('`')) {
      return (
        <code key={i} className="rounded bg-muted px-1 py-0.5 text-[0.85em] font-mono">
          {parte.slice(1, -1)}
        </code>
      );
    }
    if (parte.startsWith('*') && parte.endsWith('*') && parte.length > 2) {
      return <em key={i}>{parte.slice(1, -1)}</em>;
    }
    return <Fragment key={i}>{parte}</Fragment>;
  });
}
