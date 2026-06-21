import confetti from 'canvas-confetti';

const COLORS = ['#8b5cf6', '#22c55e', '#f59e0b', '#3b82f6', '#ec4899'];
// z-index alto para que el confeti se vea POR ENCIMA del modal (el Dialog de Radix
// crea su propio stacking context). NO usamos disableForReducedMotion: si el SO
// tiene "reducir movimiento", canvas-confetti se desactivaba y no salía nada.
const Z = 999999;

/** Estallido central de celebración (p. ej. al generar el material o aprobar). */
export function burstConfetti() {
  confetti({
    particleCount: 120,
    spread: 80,
    startVelocity: 40,
    origin: { y: 0.6 },
    colors: COLORS,
    zIndex: Z,
  });
}

/** Celebración más fuerte desde ambos lados (logro grande, p. ej. quiz aprobado). */
export function sideCannons() {
  const end = Date.now() + 700;
  (function frame() {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 60,
      origin: { x: 0 },
      colors: COLORS,
      zIndex: Z,
    });
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 60,
      origin: { x: 1 },
      colors: COLORS,
      zIndex: Z,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
