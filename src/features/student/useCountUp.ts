import { useEffect, useRef, useState } from 'react';

/** True si el usuario pidió reducir movimiento (sin animaciones). */
function prefiereReducido(): boolean {
  return (
    typeof window !== 'undefined' &&
    !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Anima un número de 0 hasta `target` con ease-out (efecto "contador").
 * Respeta prefers-reduced-motion (devuelve el valor final al instante).
 * Re-anima si `target` cambia.
 */
export function useCountUp(target: number, duration = 900): number {
  const [value, setValue] = useState(() => (prefiereReducido() ? target : 0));
  const rafRef = useRef(0);

  useEffect(() => {
    if (prefiereReducido()) {
      setValue(target);
      return;
    }
    const inicio = performance.now();
    const tick = (ahora: number) => {
      const p = Math.min(1, (ahora - inicio) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setValue(Math.round(target * eased));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}
