import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { ProfileStats } from "./profile/ProfileStats";
import { ProfileEditForm } from "./profile/ProfileEditForm";
import { ProfileAchievements } from "./profile/ProfileAchievements";
import { compressImageToDataUrl, dataUrlBytes, MAX_AVATAR_BYTES } from "./profile/avatarImage";
import { changePassword, updateProfile, deleteAccount, getMyProfileRaw, updateNotificationPrefs } from "@features/auth/services/auth.service";
import { getNotifications } from "@features/notifications/notifications.service";
import { useAuth } from "@core/auth/useAuth";

interface UserProfile {
  name: string;
  email: string;
  institution: string;
  role: string;
  memberSince: string;
  avatarColor?: string;
  avatarUrl?: string;
  /** Conteo real de recursos completados (solo estudiante). */
  recursosCompletados?: number;
}

interface ProfileDialogProps {
  open: boolean;
  onClose: () => void;
  user: UserProfile;
  initialTab?: "profile" | "settings";
}

const DEFAULT_AVATAR_COLOR = "#4F46E5";

export function ProfileDialog({ open, onClose, user, initialTab = "profile" }: ProfileDialogProps) {
  const { updateUser, logout } = useAuth();

  // Estado editable del perfil (avatar). El resto es read-only (Moodle).
  const [avatarColor, setAvatarColor] = useState(user.avatarColor ?? DEFAULT_AVATAR_COLOR);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user.avatarUrl);
  const [savedProfile, setSavedProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState("");

  // Re-sincroniza el estado local cuando cambia el usuario o se reabre el modal.
  useEffect(() => {
    if (open) {
      setAvatarColor(user.avatarColor ?? DEFAULT_AVATAR_COLOR);
      setAvatarUrl(user.avatarUrl);
      setSaveError("");
      setAvatarError("");
      setSavedProfile(false);
    }
  }, [open, user.avatarColor, user.avatarUrl]);

  // Settings (tab "Configuración") — preferencia de notificaciones de logros.
  const [notifLogros, setNotifLogros] = useState(true);
  const [savedSettings, setSavedSettings] = useState(false);
  const [exportingData, setExportingData] = useState(false);

  // Carga la preferencia real al abrir el modal.
  useEffect(() => {
    if (!open) return;
    getMyProfileRaw()
      .then((p) => setNotifLogros(p.notif_logros ?? true))
      .catch(() => {});
  }, [open]);

  const handleAvatarFileSelected = async (file: File) => {
    setAvatarError("");
    setUploadingAvatar(true);
    try {
      const dataUrl = await compressImageToDataUrl(file);
      if (dataUrlBytes(dataUrl) > MAX_AVATAR_BYTES) {
        setAvatarError("La imagen es demasiado grande incluso tras comprimir. Usa otra foto.");
        return;
      }
      setAvatarUrl(dataUrl);
    } catch (e) {
      setAvatarError(e instanceof Error ? e.message : "No se pudo procesar la imagen.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaveError("");
    setSavingProfile(true);
    try {
      await updateProfile({ avatar_color: avatarColor, avatar_url: avatarUrl ?? null });
      updateUser({ avatarColor, avatarUrl: avatarUrl ?? undefined });
      setSavedProfile(true);
      setTimeout(() => setSavedProfile(false), 2500);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "No se pudo guardar el perfil.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (current: string, next: string) => {
    await changePassword({ password_actual: current, password_nueva: next });
  };

  const handleSaveSettings = async () => {
    try {
      await updateNotificationPrefs(notifLogros);
    } catch {
      // best-effort; el toggle queda con el valor elegido localmente
    }
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2500);
  };

  // Exporta los datos del usuario (perfil + notificaciones) como JSON descargable.
  const handleExportData = async () => {
    setExportingData(true);
    try {
      let notificaciones: unknown[] = [];
      try {
        notificaciones = (await getNotifications()).items;
      } catch {
        // Si falla la carga de notis, igual exportamos el perfil.
      }
      const data = {
        exportado_en: new Date().toISOString(),
        perfil: {
          nombre: user.name,
          email: user.email,
          institucion: user.institution,
          rol: user.role,
          recursos_completados: user.recursosCompletados ?? null,
        },
        notificaciones,
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sward-mis-datos-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExportingData(false);
    }
  };

  // Elimina (desactiva) la cuenta tras confirmación y cierra la sesión.
  const handleDeleteAccount = async () => {
    const ok = window.confirm(
      "¿Seguro que quieres eliminar tu cuenta? Perderás el acceso y deberás " +
        "registrarte de nuevo. Esta acción no se puede deshacer.",
    );
    if (!ok) return;
    try {
      await deleteAccount();
      await logout();
    } catch {
      alert("No se pudo eliminar la cuenta. Inténtalo de nuevo más tarde.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-lg">Mi Cuenta</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={initialTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 mx-0 rounded-none border-b bg-transparent h-auto px-6">
            <TabsTrigger
              value="profile"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3"
            >
              Mi Perfil
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3"
            >
              Configuración
            </TabsTrigger>
          </TabsList>

          {/* PERFIL */}
          <TabsContent value="profile" className="px-6 py-5 space-y-6">
            <ProfileStats
              name={user.name}
              role={user.role}
              memberSince={user.memberSince}
              avatarColor={avatarColor}
              avatarUrl={avatarUrl}
              recursosCompletados={user.recursosCompletados}
              uploadingAvatar={uploadingAvatar}
              avatarError={avatarError}
              onAvatarColorChange={setAvatarColor}
              onAvatarFileSelected={handleAvatarFileSelected}
            />
            <ProfileEditForm
              name={user.name}
              email={user.email}
              institution={user.institution}
              onSave={handleSaveProfile}
              onCancel={onClose}
              savedProfile={savedProfile}
              savingProfile={savingProfile}
              saveError={saveError}
              onChangePassword={handleChangePassword}
            />
          </TabsContent>

          {/* CONFIGURACIÓN */}
          <TabsContent value="settings" className="px-6 py-5 space-y-6">
            <ProfileAchievements
              notifLogros={notifLogros}
              onToggleNotifLogros={() => setNotifLogros((v) => !v)}
              onExportData={handleExportData}
              onDeleteAccount={handleDeleteAccount}
              exportingData={exportingData}
              onSave={handleSaveSettings}
              onCancel={onClose}
              savedSettings={savedSettings}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
