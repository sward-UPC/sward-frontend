import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";

interface ThemeState {
  darkMode: boolean;
  compactMode: boolean;
  language: "es" | "en";
  setDarkMode: (v: boolean) => void;
  setCompactMode: (v: boolean) => void;
  setLanguage: (v: "es" | "en") => void;
}

const ThemeContext = createContext<ThemeState>({
  darkMode: false,
  compactMode: false,
  language: "es",
  setDarkMode: () => {},
  setCompactMode: () => {},
  setLanguage: () => {},
});

// Persistencia de apariencia en localStorage (sobrevive recargas).
const LS_DARK = "sward:dark";
const LS_COMPACT = "sward:compact";
const _ls = (k: string): boolean => {
  try {
    return localStorage.getItem(k) === "1";
  } catch {
    return false;
  }
};
const _setLs = (k: string, v: boolean): void => {
  try {
    localStorage.setItem(k, v ? "1" : "0");
  } catch {
    // ignorado (modo privado / sin localStorage)
  }
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkModeState] = useState(() => _ls(LS_DARK));
  const [compactMode, setCompactModeState] = useState(() => _ls(LS_COMPACT));
  const [language, setLanguageState] = useState<"es" | "en">("es");

  // Última posición del puntero: el reveal circular del tema nace justo del
  // punto que tocaste (el botón de la lámpara). Por defecto, esquina sup. dcha.
  // (donde suelen estar los toggles del topbar).
  const lastPointer = useRef({ x: window.innerWidth - 48, y: 24 });
  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      lastPointer.current = { x: e.clientX, y: e.clientY };
    };
    // Captura: corre antes que el onClick del botón, así las coordenadas ya
    // están listas cuando el handler llama a setDarkMode.
    window.addEventListener("pointerdown", onPointer, true);
    return () => window.removeEventListener("pointerdown", onPointer, true);
  }, []);

  const aplicarTema = (v: boolean) => {
    setDarkModeState(v);
    document.documentElement.classList.toggle("dark", v);
    _setLs(LS_DARK, v);
  };

  // Ref para limpiar una onda en curso si el usuario vuelve a togglear rápido.
  const waveCleanup = useRef<{ timer: number; targets: HTMLElement[] } | null>(null);

  /**
   * Cambia el tema con una onda que se propaga componente por componente desde
   * el botón del toggle (como una "infección"): cada card se oscurece/aclara
   * con un retardo proporcional a su distancia al puntero. Es CSS puro (transición
   * de color con transition-delay por elemento), así funciona en todos los
   * navegadores y deja la UI interactiva durante el efecto.
   */
  const setDarkMode = (v: boolean) => {
    const root = document.documentElement;

    // Si había una onda activa, límpiala antes de empezar otra.
    if (waveCleanup.current) {
      window.clearTimeout(waveCleanup.current.timer);
      waveCleanup.current.targets.forEach((el) => { el.style.transitionDelay = ""; });
      waveCleanup.current = null;
    }

    const { x, y } = lastPointer.current;
    const SPEED = 0.5; // ms de retardo por píxel de distancia (menor = onda más rápida)
    const MAX_DELAY = 700; // tope para que ningún componente tarde demasiado
    const DURATION = 650; // debe coincidir con view-transitions.css

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>('[data-slot="card"], [data-theme-wave]'),
    );

    root.classList.add("theme-anim");

    let maxDelay = 0;
    for (const el of targets) {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dist = Math.hypot(cx - x, cy - y);
      const delay = Math.min(dist * SPEED, MAX_DELAY);
      el.style.transitionDelay = `${delay}ms`;
      if (delay > maxDelay) maxDelay = delay;
    }

    // Aplica el tema tras un par de frames para que el navegador ya tenga
    // activas las transiciones (.theme-anim) y los delays inline; así el cambio
    // de tokens dispara la onda en vez de un salto instantáneo.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => aplicarTema(v));
    });

    const timer = window.setTimeout(() => {
      root.classList.remove("theme-anim");
      targets.forEach((el) => { el.style.transitionDelay = ""; });
      waveCleanup.current = null;
    }, maxDelay + DURATION + 100);

    waveCleanup.current = { timer, targets };
  };

  const setCompactMode = (v: boolean) => {
    setCompactModeState(v);
    const html = document.documentElement;
    if (v) html.classList.add("compact");
    else html.classList.remove("compact");
    _setLs(LS_COMPACT, v);
  };

  const setLanguage = (v: "es" | "en") => {
    setLanguageState(v);
    document.documentElement.lang = v;
  };

  // Sync on mount (in case of re-renders)
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) html.classList.add("dark"); else html.classList.remove("dark");
    if (compactMode) html.classList.add("compact"); else html.classList.remove("compact");
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode, compactMode, language, setDarkMode, setCompactMode, setLanguage }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
