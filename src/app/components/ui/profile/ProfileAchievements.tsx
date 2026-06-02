import { Button } from "../button";
import { Toggle } from "./Toggle";
import { Check, Save, Bell, Monitor, Moon, Sun, Globe, Shield, Download, Smartphone, Trash2, ChevronRight } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

interface ProfileAchievementsProps {
  notifLearning: boolean;
  notifRecommend: boolean;
  notifAchieve: boolean;
  notifEmail: boolean;
  showProgress: boolean;
  shareData: boolean;
  twoFactor: boolean;
  onToggleNotifLearning: () => void;
  onToggleNotifRecommend: () => void;
  onToggleNotifAchieve: () => void;
  onToggleNotifEmail: () => void;
  onToggleShowProgress: () => void;
  onToggleShareData: () => void;
  onToggleTwoFactor: () => void;
  onSave: () => void;
  onCancel: () => void;
  savedSettings: boolean;
}

export function ProfileAchievements({
  notifLearning,
  notifRecommend,
  notifAchieve,
  notifEmail,
  showProgress,
  shareData,
  twoFactor,
  onToggleNotifLearning,
  onToggleNotifRecommend,
  onToggleNotifAchieve,
  onToggleNotifEmail,
  onToggleShowProgress,
  onToggleShareData,
  onToggleTwoFactor,
  onSave,
  onCancel,
  savedSettings,
}: ProfileAchievementsProps) {
  const { darkMode, compactMode, language, setDarkMode, setCompactMode, setLanguage } = useTheme();

  const notificationItems = [
    { label: "Alertas de aprendizaje", desc: "Bajo rendimiento o conceptos en riesgo", value: notifLearning, set: onToggleNotifLearning },
    { label: "Nuevas recomendaciones", desc: "Cuando SAKT genera recursos personalizados", value: notifRecommend, set: onToggleNotifRecommend },
    { label: "Logros y progreso", desc: "Hitos alcanzados y mejoras de dominio", value: notifAchieve, set: onToggleNotifAchieve },
    { label: "Resumen por email", desc: "Recibir resumen semanal en tu correo", value: notifEmail, set: onToggleNotifEmail },
  ];

  const privacyItems = [
    { label: "Mostrar progreso al docente", desc: "Tu profesor puede ver tu avance detallado", value: showProgress, set: onToggleShowProgress },
    { label: "Compartir datos de aprendizaje", desc: "Mejora el modelo SAKT de forma anónima", value: shareData, set: onToggleShareData },
    { label: "Autenticación de dos factores", desc: "Mayor seguridad para tu cuenta (SMS o app)", value: twoFactor, set: onToggleTwoFactor },
  ];

  return (
    <>
      {/* Notificaciones */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 pb-1 border-b border-border">
          <Bell className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Notificaciones</h3>
        </div>
        <div className="space-y-0 divide-y divide-border">
          {notificationItems.map(({ label, desc, value, set }) => (
            <div key={label} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <Toggle checked={value} onChange={set} label={label} />
            </div>
          ))}
        </div>
      </section>

      {/* Apariencia */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 pb-1 border-b border-border">
          <Monitor className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Apariencia</h3>
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-[10px] flex items-center justify-center transition-colors ${
                darkMode ? "bg-slate-800 border border-slate-600" : "bg-slate-100 border border-slate-200"
              }`}
            >
              {darkMode ? (
                <Moon className="w-4 h-4 text-indigo-300" />
              ) : (
                <Sun className="w-4 h-4 text-yellow-500" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">Modo oscuro</p>
              <p className="text-xs text-muted-foreground">
                {darkMode ? "Activo — fondo oscuro con acento indigo" : "Inactivo — fondo claro predeterminado"}
              </p>
            </div>
          </div>
          <Toggle checked={darkMode} onChange={() => setDarkMode(!darkMode)} label="Modo oscuro" />
        </div>

        <div className="flex items-center justify-between py-2 border-t border-border">
          <div>
            <p className="text-sm font-medium">Vista compacta</p>
            <p className="text-xs text-muted-foreground">
              {compactMode ? "Activo — fuente 14px, menos espaciado" : "Inactivo — fuente 16px estándar"}
            </p>
          </div>
          <Toggle checked={compactMode} onChange={() => setCompactMode(!compactMode)} label="Vista compacta" />
        </div>

        <div className="flex items-center justify-between py-2 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] bg-muted flex items-center justify-center">
              <Globe className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Idioma de la interfaz</p>
              <p className="text-xs text-muted-foreground">
                Actualmente: {language === "es" ? "Español" : "English"}
              </p>
            </div>
          </div>
          <div className="flex gap-1.5 p-1 bg-muted rounded-[10px]">
            {(["es", "en"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                  language === lang
                    ? "bg-card shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {lang === "es" ? "ES" : "EN"}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Privacidad */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 pb-1 border-b border-border">
          <Shield className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Privacidad y Seguridad</h3>
        </div>
        <div className="space-y-0 divide-y divide-border">
          {privacyItems.map(({ label, desc, value, set }) => (
            <div key={label} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <div className="flex items-center gap-2">
                {label.includes("dos factores") && value && (
                  <span className="text-xs text-success font-medium">Activo</span>
                )}
                <Toggle checked={value} onChange={set} label={label} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Datos */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 pb-1 border-b border-border">
          <Globe className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Datos y cuenta</h3>
        </div>
        <div className="space-y-2">
          <button className="w-full flex items-center justify-between p-3 border border-border rounded-[12px] hover:bg-muted/50 transition-colors text-sm">
            <span className="flex items-center gap-2">
              <Download className="w-4 h-4 text-muted-foreground" />
              Exportar mis datos de aprendizaje
            </span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="w-full flex items-center justify-between p-3 border border-border rounded-[12px] hover:bg-muted/50 transition-colors text-sm">
            <span className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-muted-foreground" />
              Sesiones activas
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              1 dispositivo <ChevronRight className="w-4 h-4" />
            </span>
          </button>
          <button className="w-full flex items-center justify-between p-3 border border-destructive/20 rounded-[12px] hover:bg-destructive/5 transition-colors text-sm text-destructive">
            <span className="flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Eliminar cuenta
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <div className="flex gap-2 pt-2">
        <Button onClick={onSave} className="flex-1 gap-2">
          {savedSettings ? (
            <>
              <Check className="w-4 h-4" /> Guardado
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Guardar configuración
            </>
          )}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </>
  );
}
