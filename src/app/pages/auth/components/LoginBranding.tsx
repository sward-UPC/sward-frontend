import { BrainCircuit, GraduationCap, ShieldCheck } from "lucide-react";

export function LoginBranding() {
  return (
    <div
      className="hidden lg:flex flex-col justify-between p-10 relative overflow-hidden"
      style={{
        width: "42%",
        background: "linear-gradient(155deg, #312e81 0%, #4338ca 40%, #6d28d9 100%)",
      }}
    >
      {/* Background orbs */}
      <div
        className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #a5b4fc, transparent)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #818cf8, transparent)" }}
      />

      {/* Logo */}
      <div className="flex items-center gap-2.5 relative z-10">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.3)" }}
        >
          <span className="text-base font-black text-white">S</span>
        </div>
        <span className="font-bold text-lg tracking-tight text-white">SWARD</span>
      </div>

      {/* Hero text */}
      <div className="relative z-10 space-y-6">
        <div>
          <h1 className="text-white leading-tight" style={{ fontSize: "2.4rem", fontWeight: 700, lineHeight: 1.15 }}>
            Aprende con<br />
            <span style={{ color: "#a5b4fc" }}>inteligencia</span><br />
            <span style={{ color: "#c4b5fd" }}>adaptativa.</span>
          </h1>
          <p className="text-indigo-200 mt-4 leading-relaxed" style={{ fontSize: "0.95rem", maxWidth: 320 }}>
            El sistema que entiende cómo aprendes y explica cada recomendación que te hace.
          </p>
        </div>

        {/* Feature badges */}
        <div className="space-y-3.5">
          {[
            { icon: BrainCircuit, label: "IA Explicable", desc: "Comprende el porqué de cada recomendación" },
            { icon: GraduationCap, label: "Adaptativo", desc: "Recursos ajustados a tu nivel real en tiempo real" },
            { icon: ShieldCheck, label: "Trazable", desc: "Cada decisión del modelo es auditable y transparente" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
              >
                <Icon className="w-4 h-4 text-indigo-200" />
              </div>
              <div>
                <p className="text-white text-sm" style={{ fontWeight: 600 }}>{label}</p>
                <p className="text-indigo-300" style={{ fontSize: "0.78rem" }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <p className="text-indigo-400 relative z-10" style={{ fontSize: "0.72rem" }}>
        © 2026 SWARD — WCAG 2.1 AA
      </p>
    </div>
  );
}
