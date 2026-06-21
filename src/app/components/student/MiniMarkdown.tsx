import { Fragment, type ReactNode } from 'react';

/**
 * Renderizador de markdown mínimo y seguro (sin dependencias ni HTML crudo):
 * soporta **negrita**, *cursiva*, `código`, bloques ```código```, listas con "- ",
 * tablas (GitHub-flavored) y saltos de línea. Pensado para mostrar
 * respuestas/soluciones/feedback con formato.
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
    <div className={`${className ?? ''} min-w-0 break-words [overflow-wrap:anywhere]`}>
      {bloques.map((bloque, i) => {
        // Índices impares = dentro de ``` ``` → bloque de código.
        if (i % 2 === 1) {
          return (
            <pre
              key={i}
              className="my-2 max-w-full overflow-x-auto rounded-[8px] bg-muted px-3 py-2 text-xs font-mono leading-relaxed"
            >
              <code className="whitespace-pre">{bloque.replace(/^\n/, '').replace(/\n$/, '')}</code>
            </pre>
          );
        }
        return <Fragment key={i}>{renderParrafos(bloque)}</Fragment>;
      })}
    </div>
  );
}

/** Agrupa líneas en párrafos, listas (con "- ") y tablas (GitHub-flavored). */
function renderParrafos(texto: string): ReactNode {
  const lineas = texto.split('\n');
  const out: ReactNode[] = [];
  let lista: string[] = [];

  const volcarLista = (key: string) => {
    if (lista.length === 0) return;
    out.push(
      <ul key={key} className="my-1.5 ml-4 list-disc space-y-0.5">
        {lista.map((li, j) => (
          <li key={j} className="break-words">{inline(li)}</li>
        ))}
      </ul>,
    );
    lista = [];
  };

  for (let i = 0; i < lineas.length; i++) {
    const linea = lineas[i];

    // ¿Empieza una tabla en esta línea? (encabezado con "|" + separador válido debajo)
    if (esFilaTabla(linea) && esFilaSeparadora(lineas[i + 1])) {
      volcarLista(`ul-${i}`);
      const alineaciones = parsearSeparadora(lineas[i + 1]);
      const filas: string[] = [];
      let j = i + 2;
      while (j < lineas.length && esFilaTabla(lineas[j])) {
        filas.push(lineas[j]);
        j++;
      }
      out.push(renderTabla(linea, alineaciones, filas, `tabla-${i}`));
      i = j - 1;
      continue;
    }

    const m = linea.match(/^\s*[-*]\s+(.*)/);
    if (m) {
      lista.push(m[1]);
      continue;
    }
    volcarLista(`ul-${i}`);
    if (linea.trim()) {
      out.push(
        <p key={`p-${i}`} className="my-1 leading-relaxed break-words">
          {inline(linea)}
        </p>,
      );
    }
  }
  volcarLista('ul-fin');
  return out;
}

/** ¿La línea parece una fila de tabla? (contiene al menos un "|" con contenido alrededor) */
function esFilaTabla(linea: string | undefined): boolean {
  if (linea == null) return false;
  return linea.includes('|') && linea.trim().length > 0;
}

/**
 * ¿La línea es una fila separadora de tabla?
 * Ej: `|---|---|`, `---|---`, `|:--|:-:|--:|`. Cada celda son guiones con `:` opcionales.
 */
function esFilaSeparadora(linea: string | undefined): boolean {
  if (linea == null || !linea.includes('|')) return false;
  const celdas = partirCeldas(linea);
  if (celdas.length === 0) return false;
  return celdas.every((c) => /^:?-+:?$/.test(c.trim()));
}

/** Divide una fila de tabla en celdas, tolerando pipes externos opcionales y espacios. */
function partirCeldas(linea: string): string[] {
  let s = linea.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|')) s = s.slice(0, -1);
  return s.split('|').map((c) => c.trim());
}

type Alineacion = 'left' | 'center' | 'right';

/** Deriva la alineación de cada columna a partir de la fila separadora. */
function parsearSeparadora(linea: string): Alineacion[] {
  return partirCeldas(linea).map((c) => {
    const t = c.trim();
    const izq = t.startsWith(':');
    const der = t.endsWith(':');
    if (izq && der) return 'center';
    if (der) return 'right';
    return 'left';
  });
}

const claseAlineacion: Record<Alineacion, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

/** Renderiza una tabla markdown como <table> con estilos del proyecto. */
function renderTabla(
  encabezado: string,
  alineaciones: Alineacion[],
  filasDatos: string[],
  key: string,
): ReactNode {
  const encabezados = partirCeldas(encabezado);
  const nCols = encabezados.length;
  const alinear = (i: number): Alineacion => alineaciones[i] ?? 'left';

  const ajustar = (celdas: string[]): string[] => {
    const r = celdas.slice(0, nCols);
    while (r.length < nCols) r.push('');
    return r;
  };

  return (
    <div key={key} className="my-2 overflow-x-auto rounded-[8px] border border-border">
      <table className="w-full border-collapse text-sm tabular-nums">
        <thead>
          <tr>
            {encabezados.map((celda, c) => (
              <th
                key={c}
                className={`border border-border bg-muted/50 px-3 py-1.5 font-semibold ${claseAlineacion[alinear(c)]}`}
              >
                {inline(celda)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filasDatos.map((fila, r) => (
            <tr key={r} className="even:bg-muted/20">
              {ajustar(partirCeldas(fila)).map((celda, c) => (
                <td
                  key={c}
                  className={`border border-border px-3 py-1.5 ${claseAlineacion[alinear(c)]}`}
                >
                  {inline(celda)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
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
        <code key={i} className="rounded bg-muted px-1 py-0.5 text-[0.85em] font-mono break-words [overflow-wrap:anywhere]">
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
