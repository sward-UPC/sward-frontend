import { createContext, useContext, useEffect, useState, ReactNode } from "react";

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

  const setDarkMode = (v: boolean) => {
    setDarkModeState(v);
    const html = document.documentElement;
    if (v) html.classList.add("dark");
    else html.classList.remove("dark");
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
