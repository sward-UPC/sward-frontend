import { useState } from "react";
import { Button } from "../button";
import { Label } from "../label";
import { Progress } from "../progress";
import { User, Mail, Building2, Lock, Eye, EyeOff, Check, Save } from "lucide-react";

interface ProfileEditFormProps {
  name: string;
  email: string;
  institution: string;
  bio: string;
  onNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onInstitutionChange: (v: string) => void;
  onBioChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
  savedProfile: boolean;
}

function FieldInput({
  id,
  value,
  onChange,
  placeholder,
  icon: Icon,
  type = "text",
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon: React.ElementType;
  type?: string;
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
  bio,
  onNameChange,
  onEmailChange,
  onInstitutionChange,
  onBioChange,
  onSave,
  onCancel,
  savedProfile,
}: ProfileEditFormProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");

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
          <FieldInput
            id="name"
            value={name}
            onChange={onNameChange}
            placeholder="Tu nombre completo"
            icon={User}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Correo electrónico</Label>
          <FieldInput
            id="email"
            value={email}
            onChange={onEmailChange}
            placeholder="tu@email.com"
            icon={Mail}
            type="email"
          />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="institution">Institución</Label>
          <FieldInput
            id="institution"
            value={institution}
            onChange={onInstitutionChange}
            placeholder="Nombre de tu institución"
            icon={Building2}
          />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="bio">Biografía</Label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => onBioChange(e.target.value)}
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
              <p className={`text-xs ${strengthColor}`}>
                Seguridad: {strengthLabel}
              </p>
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
        <Button onClick={onSave} className="flex-1 gap-2">
          {savedProfile ? (
            <>
              <Check className="w-4 h-4" /> Guardado
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Guardar cambios
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
