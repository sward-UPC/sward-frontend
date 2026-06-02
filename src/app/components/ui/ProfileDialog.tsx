import { useState } from "react";
import { Button } from "./Button";
import { Label } from "./Label";
import { Progress } from "./Progress";
import { Badge } from "./Badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./Dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";
import { useTheme } from "../../context/ThemeContext";
import {
  User, Mail, Building2, BookOpen, Camera, Save, Bell,
  Moon, Sun, Globe, Shield, Eye, EyeOff, Check, Trash2,
  Download, Lock, Smartphone, ChevronRight, Monitor,
} from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  institution: string;
  role: string;
  avatar: string;
  memberSince: string;
  bio?: string;
}

interface ProfileDialogProps {
  open: boolean;
  onClose: () => void;
  user: UserProfile;
  initialTab?: "profile" | "settings";
}

const AVATAR_COLORS = [
  { bg: "#4F46E5", label: "Morado" },
  { bg: "#0EA5E9", label: "Azul" },
  { bg: "#10B981", label: "Verde" },
  { bg: "#F59E0B", label: "Ámbar" },
  { bg: "#EF4444", label: "Rojo" },
  { bg: "#8B5CF6", label: "Violeta" },
  { bg: "#EC4899", label: "Rosa" },
  { bg: "#14B8A6", label: "Teal" },
];

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label?: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
        checked ? "bg-primary" : "bg-muted-foreground/30"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function FieldInput({
  id, value, onChange, placeholder, icon: Icon, type = "text",
}: {
  id: string; value: string; onChange: (v: string) => void;
  placeholder?: string; icon: any; type?: string;
}) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2.5 rounded-[12px] border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
      />
    </div>
  );
}

export function ProfileDialog({ open, onClose, user, initialTab = "profile" }: ProfileDialogProps) {
  const { darkMode, compactMode, language, setDarkMode, setCompactMode, setLanguage } = useTheme();

  // Profile state
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [institution, setInstitution] = useState(user.institution);
  const [bio, setBio] = useState(user.bio || "Estudiante apasionado por la Inteligencia Artificial y el Machine Learning.");
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0].bg);
  const [savedProfile, setSavedProfile] = useState(false);

  // Notification toggles (local only – would persist to backend in real app)
  const [notifLearning, setNotifLearning] = useState(true);
  const [notifRecommend, setNotifRecommend] = useState(true);
  const [notifAchieve, setNotifAchieve] = useState(true);
  const [notifEmail, setNotifEmail] = useState(false);

  // Privacy toggles
  const [showProgress, setShowProgress] = useState(true);
  const [shareData, setShareData] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [savedSettings, setSavedSettings] = useState(false);

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleSaveProfile = () => {
    setSavedProfile(true);
    setTimeout(() => setSavedProfile(false), 2500);
  };

  const handleSaveSettings = () => {
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2500);
  };

  const handleSavePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Completa todos los campos.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden.");
      return;
    }
    setPasswordError("");
    setPasswordSaved(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordSaved(false), 2500);
  };

  const passwordStrength = (pw: string) => {
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 8) s += 25;
    if (/[A-Z]/.test(pw)) s += 25;
    if (/[0-9]/.test(pw)) s += 25;
    if (/[^A-Za-z0-9]/.test(pw)) s += 25;
    return s;
  };

  const strength = passwordStrength(newPassword);
  const strengthLabel = strength <= 25 ? "Débil" : strength <= 50 ? "Regular" : strength <= 75 ? "Buena" : "Fuerte";
  const strengthColor = strength <= 25 ? "text-destructive" : strength <= 50 ? "text-warning" : strength <= 75 ? "text-blue-500" : "text-success";

  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-lg">Mi Cuenta</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={initialTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 mx-0 rounded-none border-b bg-transparent h-auto px-6">
            <TabsTrigger value="profile" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3">
              Mi Perfil
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3">
              Configuración
            </TabsTrigger>
          </TabsList>

          {/* ─── PERFIL ─── */}
          <TabsContent value="profile" className="px-6 py-5 space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md"
                  style={{ background: avatarColor }}
                >
                  {initials}
                </div>
                <button className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-sm">
                  <Camera className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium mb-2">Color de avatar</p>
                <div className="flex gap-2 flex-wrap">
                  {AVATAR_COLORS.map((c) => (
                    <button
                      key={c.bg}
                      onClick={() => setAvatarColor(c.bg)}
                      className="w-7 h-7 rounded-full transition-transform hover:scale-110 relative"
                      style={{ background: c.bg }}
                      title={c.label}
                    >
                      {avatarColor === c.bg && (
                        <Check className="w-3.5 h-3.5 text-white absolute inset-0 m-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="gap-1.5">
                <BookOpen className="w-3 h-3" /> 12 recursos completados
              </Badge>
              <Badge variant="outline" className="gap-1.5">
                <User className="w-3 h-3" /> {user.role}
              </Badge>
              <Badge variant="outline" className="gap-1.5 text-muted-foreground">
                Desde {user.memberSince}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Nombre completo</Label>
                <FieldInput id="name" value={name} onChange={setName} placeholder="Tu nombre completo" icon={User} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Correo electrónico</Label>
                <FieldInput id="email" value={email} onChange={setEmail} placeholder="tu@email.com" icon={Mail} type="email" />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="institution">Institución</Label>
                <FieldInput id="institution" value={institution} onChange={setInstitution} placeholder="Nombre de tu institución" icon={Building2} />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="bio">Biografía</Label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  maxLength={200}
                  className="w-full rounded-[12px] border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none transition-colors"
                  placeholder="Cuéntanos un poco sobre ti..."
                />
                <p className="text-xs text-muted-foreground text-right">{bio.length}/200</p>
              </div>
            </div>

            {/* Password */}
            <div className="border border-border rounded-[12px] p-4 space-y-3">
              <p className="text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
                Cambiar contraseña
              </p>
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    placeholder="Contraseña actual"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full pl-3 pr-9 py-2.5 rounded-[12px] border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    placeholder="Nueva contraseña"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-3 pr-9 py-2.5 rounded-[12px] border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {newPassword && (
                  <div className="space-y-1">
                    <Progress value={strength} className="h-1.5" />
                    <p className={`text-xs ${strengthColor}`}>Seguridad: {strengthLabel}</p>
                  </div>
                )}
                <input
                  type="password"
                  placeholder="Confirmar nueva contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-3 pr-4 py-2.5 rounded-[12px] border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
                {passwordError && <p className="text-xs text-destructive">{passwordError}</p>}
                {passwordSaved && (
                  <p className="text-xs text-success flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Contraseña actualizada
                  </p>
                )}
                <Button size="sm" variant="outline" onClick={handleSavePassword} className="w-full">
                  Actualizar contraseña
                </Button>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={handleSaveProfile} className="flex-1 gap-2">
                {savedProfile ? <><Check className="w-4 h-4" /> Guardado</> : <><Save className="w-4 h-4" /> Guardar cambios</>}
              </Button>
              <Button variant="outline" onClick={onClose}>Cancelar</Button>
            </div>
          </TabsContent>

          {/* ─── CONFIGURACIÓN ─── */}
          <TabsContent value="settings" className="px-6 py-5 space-y-6">

            {/* Notificaciones */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-border">
                <Bell className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm">Notificaciones</h3>
              </div>
              <div className="space-y-0 divide-y divide-border">
                {[
                  { label: "Alertas de aprendizaje", desc: "Bajo rendimiento o conceptos en riesgo", value: notifLearning, set: () => setNotifLearning(!notifLearning) },
                  { label: "Nuevas recomendaciones", desc: "Cuando SAKT genera recursos personalizados", value: notifRecommend, set: () => setNotifRecommend(!notifRecommend) },
                  { label: "Logros y progreso", desc: "Hitos alcanzados y mejoras de dominio", value: notifAchieve, set: () => setNotifAchieve(!notifAchieve) },
                  { label: "Resumen por email", desc: "Recibir resumen semanal en tu correo", value: notifEmail, set: () => setNotifEmail(!notifEmail) },
                ].map(({ label, desc, value, set }) => (
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

              {/* Dark mode – live preview */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center transition-colors ${darkMode ? "bg-slate-800 border border-slate-600" : "bg-slate-100 border border-slate-200"}`}>
                    {darkMode ? <Moon className="w-4 h-4 text-indigo-300" /> : <Sun className="w-4 h-4 text-yellow-500" />}
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

              {/* Compact mode */}
              <div className="flex items-center justify-between py-2 border-t border-border">
                <div>
                  <p className="text-sm font-medium">Vista compacta</p>
                  <p className="text-xs text-muted-foreground">
                    {compactMode ? "Activo — fuente 14px, menos espaciado" : "Inactivo — fuente 16px estándar"}
                  </p>
                </div>
                <Toggle checked={compactMode} onChange={() => setCompactMode(!compactMode)} label="Vista compacta" />
              </div>

              {/* Language */}
              <div className="flex items-center justify-between py-2 border-t border-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[10px] bg-muted flex items-center justify-center">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Idioma de la interfaz</p>
                    <p className="text-xs text-muted-foreground">Actualmente: {language === "es" ? "Español" : "English"}</p>
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
                {[
                  { label: "Mostrar progreso al docente", desc: "Tu profesor puede ver tu avance detallado", value: showProgress, set: () => setShowProgress(!showProgress) },
                  { label: "Compartir datos de aprendizaje", desc: "Mejora el modelo SAKT de forma anónima", value: shareData, set: () => setShareData(!shareData) },
                  { label: "Autenticación de dos factores", desc: "Mayor seguridad para tu cuenta (SMS o app)", value: twoFactor, set: () => setTwoFactor(!twoFactor) },
                ].map(({ label, desc, value, set }) => (
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
              <Button onClick={handleSaveSettings} className="flex-1 gap-2">
                {savedSettings ? <><Check className="w-4 h-4" /> Guardado</> : <><Save className="w-4 h-4" /> Guardar configuración</>}
              </Button>
              <Button variant="outline" onClick={onClose}>Cancelar</Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
