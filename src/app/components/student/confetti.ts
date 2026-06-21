import confetti from 'canvas-confetti';

const COLORS = ['#8b5cf6', '#22c55e', '#f59e0b', '#3b82f6', '#ec4899'];

/** Estallido central de celebración (p. ej. al generar el material o aprobar). */
export function burstConfetti() {
  confetti({
    particleCount: 110,
    spread: 75,
    startVelocity: 38,
    origin: { y: 0.6 },
    colors: COLORS,
    disableForReducedMotion: true,
  });
}

/** Celebración más fuerte desde ambos lados (logro grande, p. ej. quiz aprobado). */
export function sideCannons() {
  const end = Date.now() + 700;
  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: COLORS,
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: COLORS,
      disableForReducedMotion: true,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
