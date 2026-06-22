import { BrainCircuit, GraduationCap, ShieldCheck } from "lucide-react";

/**
 * Panel de marca del login. El fondo no usa "orbs" genéricos sino un grafo de
 * conocimiento/atención (lo que realmente modela el SAKT de SWARD): nodos
 * conectados con un pulso sutil y una arista con "flujo" de datos. Es identidad
 * propia del producto, no un template de IA.
 */

// Nodos del grafo (coords en el viewBox 320×560).
const NODES: { x: number; y: number; r: number; pulse?: number }[] = [
  { x: 70, y: 70, r: 4 },
  { x: 175, y: 50, r: 5, pulse: 0 },
  { x: 255, y: 110, r: 3.5 },
  { x: 120, y: 150, r: 3.5 },
  { x: 225, y: 205, r: 5, pulse: 0.8 },
  { x: 60, y: 250, r: 3.5 },
  { x: 165, y: 285, r: 6, pulse: 1.6 },
  { x: 270, y: 320, r: 4 },
  { x: 110, y: 380, r: 4, pulse: 2.4 },
  { x: 240, y: 430, r: 3.5 },
  { x: 150, y: 480, r: 5, pulse: 1.2 },
];
const EDGES: [number, number][] = [
  [0, 1], [1, 2], [0, 3], [1, 3], [3, 4], [2, 4], [3, 5],
  [4, 6], [5, 6], [6, 7], [4, 7], [5, 8], [6, 8], [7, 9],
  [8, 10], [9, 10], [6, 9],
];

const KEYFRAMES = `
@keyframes sward-node {
  0%, 100% { opacity: .35; }
  50% { opacity: 1; }
}
@keyframes sward-flow {
  to { stroke-dashoffset: -28; }
}`;

export function LoginBranding() {
  return (
    <div
      className="hidden lg:flex flex-col justify-between p-10 relative overflow-hidden"
      style={{
        width: "42%",
        background:
          "radial-gradient(120% 90% at 80% 0%, #4c1d95 0%, transparent 55%), linear-gradient(160deg, #1e1b4b 0%, #312e81 50%, #3730a3 100%)",
      }}
    >
      <style>{KEYFRAMES}</style>

      {/* Textura de puntos sutil (profundidad sin ruido genérico) */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.06,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Grafo de conocimiento / atención (motivo propio de SWARD) */}
      <svg
        aria-hidden
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 320 560"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity: 0.5 }}
      >
        {EDGES.map(([a, b], i) => {
          const flow = i % 6 === 0; // algunas aristas "fluyen"
          return (
            <line
              key={`e${i}`}
              x1={NODES[a].x}
              y1={NODES[a].y}
              x2={NODES[b].x}
              y2={NODES[b].y}
              stroke="#a5b4fc"
              strokeOpacity={flow ? 0.55 : 0.22}
              strokeWidth={1}
              strokeDasharray={flow ? "4 6" : undefined}
              style={flow ? { animation: "sward-flow 1.6s linear infinite" } : undefined}
            />
          );
        })}
        {NODES.map((n, i) => (
          <circle
            key={`n${i}`}
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill="#c7d2fe"
            style={
              n.pulse !== undefined
                ? { animation: `sward-node 3.2s ease-in-out ${n.pulse}s infinite` }
                : { opacity: 0.45 }
            }
          />
        ))}
      </svg>

      {/* Logo */}
      <div className="flex items-center gap-2.5 relative z-10">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{
            background: "rgba(255,255,255,0.16)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.28)",
          }}
        >
          <span className="text-base font-black text-white">S</span>
        </div>
        <span className="font-bold text-lg tracking-tight text-white">SWARD</span>
      </div>

      {/* Hero */}
      <div className="relative z-10 space-y-7">
        <div>
          <p
            className="text-indigo-300 font-semibold mb-3"
            style={{ fontSize: "0.7rem", letterSpacing: "0.18em" }}
          >
            APRENDIZAJE ADAPTATIVO · IA EXPLICABLE
          </p>
          <h1
            className="text-white"
            style={{ fontSize: "2.5rem", fontWeight: 700, lineHeight: 1.12, letterSpacing: "-0.02em" }}
          >
            Aprende a tu
            <br />
            ritmo, con un
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #a5b4fc, #c4b5fd)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              modelo que explica
            </span>
            <br />
            sus decisiones.
          </h1>
          <p
            className="text-indigo-200/80 mt-4 leading-relaxed"
            style={{ fontSize: "0.95rem", maxWidth: 340 }}
          >
            SWARD detecta cómo aprendes y te recomienda el siguiente recurso —
            mostrándote siempre el porqué.
          </p>
        </div>

        {/* Features: lista editorial con divisores finos (sin chips de vidrio) */}
        <div className="border-t border-white/10">
          {[
            { icon: BrainCircuit, label: "IA Explicable", desc: "Comprende el porqué de cada recomendación" },
            { icon: GraduationCap, label: "Adaptativo", desc: "Recursos ajustados a tu nivel real, en tiempo real" },
            { icon: ShieldCheck, label: "Trazable", desc: "Cada decisión del modelo es auditable y transparente" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-3.5 py-3.5 border-b border-white/10">
              <div
                className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: "rgba(165,180,252,0.12)", border: "1px solid rgba(165,180,252,0.22)" }}
              >
                <Icon className="w-[18px] h-[18px] text-indigo-200" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm" style={{ fontWeight: 600 }}>{label}</p>
                <p className="text-indigo-200/65" style={{ fontSize: "0.8rem", lineHeight: 1.4 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center gap-3 text-indigo-300/70" style={{ fontSize: "0.72rem" }}>
        <span>© 2026 SWARD</span>
        <span className="w-1 h-1 rounded-full bg-indigo-300/40" />
        <span>WCAG 2.1 AA</span>
      </div>
    </div>
  );
}
