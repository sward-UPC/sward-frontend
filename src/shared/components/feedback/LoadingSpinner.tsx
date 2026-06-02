interface LoadingSpinnerProps {
  /** Tamaño del spinner en clases Tailwind. Default: 'w-8 h-8'. */
  size?: string;
  /** Texto accesible para screen readers. */
  label?: string;
}

/** Spinner de carga accesible. */
export function LoadingSpinner({
  size = 'w-8 h-8',
  label = 'Cargando...',
}: LoadingSpinnerProps) {
  return (
    <div role="status" aria-label={label} className="flex items-center justify-center p-4">
      <div
        className={`${size} border-4 border-muted border-t-primary rounded-full animate-spin`}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
