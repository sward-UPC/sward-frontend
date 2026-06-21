import { useState } from "react";
import { Button } from "../button";
import { Label } from "../label";
import { Progress } from "../progress";
import { User, Mail, Building2, Lock, Eye, EyeOff, Check, Save, Loader2 } from "lucide-react";

interface ProfileEditFormProps {
  name: string;
  email: string;
  institution: string;
  /** Persiste los cambios editables (avatar). Devuelve éxito/falla. */
  onSave: () => void;
  onCancel: () => void;
  savedProfile: boolean;
  savingProfile?: boolean;
  saveError?: string;
  /** Cambia la contraseña contra el backend. Lanza Error con mensaje en falla. */
  onChangePassword: (current: string, next: string) => Promise<void>;
}

/** Campo de solo lectura (datos gestionados desde Moodle). */
function ReadOnlyField({
  id,
  value,
  icon: Icon,
}: {
  id: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        id={id}
        type="text"
        value={value}
        disabled
        readOnly
        className="w-full pl-9 pr-4 py-2.5 rounded-[12px] border border-input bg-muted/50 text-sm text-muted-foreground cursor-not-allowed"
      />
    </div>
  );
}

function passwordStrength(pw: string): number {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s += 25;
  if (/[A-Z]/.test(pw)) s += 25;
  if (/[0-9]/.test(pw)) s += 25;
  if (/[^A-Za-z0-9]/.test(pw)) s += 25;
  return s;
}

export function ProfileEditForm({
  name,
  email,
  institution,
  onSave,
  onCancel,
  savedProfile,
  savingProfile = false,
  saveError,
  onChangePassword,
}: ProfileEditFormProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const handleSavePassword = async () => {
    setPasswordSaved(false);
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Completa todos los campos.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (passwordStrength(newPassword) < 75) {
      setPasswordError("Usa mayúscula, número y al menos 8 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden.");
      return;
    }
    if (newPassword === currentPassword) {
      setPasswordError("La nueva contraseña debe ser distinta de la actual.");
      return;
    }
    setPasswordError("");
    setChangingPassword(true);
    try {
      await onChangePassword(currentPassword, newPassword);
      setPasswordSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSaved(false), 4000);
    } catch (e) {
      setPasswordError(e instanceof Error ? e.message : "No se pudo cambiar la contraseña.");
    } finally {
      setChangingPassword(false);
    }
  };

  const strength = passwordStrength(newPassword);
  const strengthLabel =
    strength <= 25 ? "Débil" : strength <= 50 ? "Regular" : strength <= 75 ? "Buena" : "Fuerte";
  const strengthColor =
    strength <= 25
      ? "text-destructive"
      : strength <= 50
      ? "text-warning"
      : strength <= 75
      ? "text-blue-500"
      : "text-success";

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nombre completo</Label>
          <ReadOnlyField id="name" value={name} icon={User} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Correo electrónico</Label>
          <ReadOnlyField id="email" value={email} icon={Mail} />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="institution">Institución</Label>
          <ReadOnlyField id="institution" value={institution || "—"} icon={Building2} />
        </div>
        <p className="text-xs text-muted-foreground md:col-span-2">
          Nombre, correo e institución se gestionan desde Moodle y no pueden editarse aquí.
        </p>
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
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
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
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
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
              <Check className="w-3.5 h-3.5" /> Contraseña actualizada. Vuelve a iniciar sesión en
              tus otros dispositivos.
            </p>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={handleSavePassword}
            disabled={changingPassword}
            className="w-full gap-2"
          >
            {changingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
            Actualizar contraseña
          </Button>
        </div>
      </div>

      {saveError && <p className="text-xs text-destructive">{saveError}</p>}

      <div className="flex gap-2 pt-2">
        <Button onClick={onSave} disabled={savingProfile} className="flex-1 gap-2">
          {savingProfile ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Guardando
            </>
          ) : savedProfile ? (
            <>
              <Check className="w-4 h-4" /> Guardado
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Guardar perfil
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
