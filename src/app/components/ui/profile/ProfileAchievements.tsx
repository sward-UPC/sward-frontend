import { Button } from "../button";
import { Toggle } from "./Toggle";
import { Check, Save, Bell, Monitor, Moon, Sun, Globe, Download, Smartphone, Trash2, ChevronRight } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

interface ProfileAchievementsProps {
  notifLogros: boolean;
  onToggleNotifLogros: () => void;
  onExportData: () => void;
  onDeleteAccount: () => void;
  exportingData?: boolean;
  onSave: () => void;
  onCancel: () => void;
  savedSettings: boolean;
}

export function ProfileAchievements({
  notifLogros,
  onToggleNotifLogros,
  onExportData,
  onDeleteAccount,
  exportingData = false,
  onSave,
  onCancel,
  savedSettings,
}: ProfileAchievementsProps) {
  const { darkMode, compactMode, setDarkMode, setCompactMode } = useTheme();

  const notificationItems = [
    { label: "Logros y progreso", desc: "Hitos alcanzados: rachas y recursos completados", value: notifLogros, set: onToggleNotifLogros },
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
      </section>

      {/* Datos */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 pb-1 border-b border-border">
          <Globe className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Datos y cuenta</h3>
        </div>
        <div className="space-y-2">
          <button
            onClick={onExportData}
            disabled={exportingData}
            className="w-full flex items-center justify-between p-3 border border-border rounded-[12px] hover:bg-muted/50 transition-colors text-sm disabled:opacity-60"
          >
            <span className="flex items-center gap-2">
              <Download className="w-4 h-4 text-muted-foreground" />
              Exportar mis datos
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              {exportingData ? "Generando…" : "JSON"} <ChevronRight className="w-4 h-4" />
            </span>
          </button>
          {/* Sesión actual (informativo, sin tracking multi-dispositivo). */}
          <div className="w-full flex items-center justify-between p-3 border border-border rounded-[12px] text-sm">
            <span className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-muted-foreground" />
              Sesión actual
            </span>
            <span className="text-xs text-muted-foreground">Este dispositivo</span>
          </div>
          <button
            onClick={onDeleteAccount}
            className="w-full flex items-center justify-between p-3 border border-destructive/20 rounded-[12px] hover:bg-destructive/5 transition-colors text-sm text-destructive"
          >
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
