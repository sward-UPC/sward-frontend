import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";

/** document.startViewTransition aún no está en los tipos de TS por defecto. */
type DocWithVT = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

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

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkModeState] = useState(false);
  const [compactMode, setCompactModeState] = useState(false);
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
  };

  const setDarkMode = (v: boolean) => {
    const doc = document as DocWithVT;
    // Sin soporte de View Transitions (Firefox, Safari antiguos) → cambio directo.
    if (typeof doc.startViewTransition !== "function") {
      aplicarTema(v);
      return;
    }

    const { x, y } = lastPointer.current;
    // Radio hasta la esquina más lejana, para que el círculo cubra toda la pantalla.
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = doc.startViewTransition(() => aplicarTema(v));
    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 480,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            // El tema NUEVO se revela expandiéndose desde el toggle: al oscurecer,
            // la "oscuridad" se derrama desde la lámpara; al aclarar, la luz.
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(() => {
        // Si la transición se cancela, el tema ya quedó aplicado en el callback.
      });
  };

  const setCompactMode = (v: boolean) => {
    setCompactModeState(v);
    const html = document.documentElement;
    if (v) html.classList.add("compact");
    else html.classList.remove("compact");
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
