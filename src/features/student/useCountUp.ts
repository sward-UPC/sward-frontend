import { useEffect, useRef, useState } from 'react';

/**
 * Anima un número hasta `target` con ease-out (efecto "contador").
 *
 * Anima desde el valor ACTUAL mostrado, no siempre desde 0: en la primera carga
 * cuenta 0 → valor, pero cuando llegan más datos (varias queries que resuelven en
 * momentos distintos) hace una transición suave actual → nuevo en vez de reiniciar a 0
 * y re-contar (que se veía roto/glitchy).
 *
 * Nota: este efecto NO se desactiva con prefers-reduced-motion a propósito — es una
 * animación de marca pedida explícitamente (igual que los charts de Recharts, que
 * tampoco la respetan). Es un contador suave, no movimiento agresivo.
 */
export function useCountUp(target: number, duration = 900): number {
  const [value, setValue] = useState(0);
  const rafRef = useRef(0);
  // Espejo del valor mostrado para arrancar la animación desde ahí sin re-disparar
  // el efecto en cada frame.
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    const desde = valueRef.current;
    if (desde === target) return; // ya estamos ahí
    const inicio = performance.now();
    const tick = (ahora: number) => {
      const p = Math.min(1, (ahora - inicio) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setValue(Math.round(desde + (target - desde) * eased));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}
