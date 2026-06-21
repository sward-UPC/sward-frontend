import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { ProfileStats } from "./profile/ProfileStats";
import { ProfileEditForm } from "./profile/ProfileEditForm";
import { ProfileAchievements } from "./profile/ProfileAchievements";
import { compressImageToDataUrl, dataUrlBytes, MAX_AVATAR_BYTES } from "./profile/avatarImage";
import { changePassword, updateProfile } from "@features/auth/services/auth.service";
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
  const { updateUser } = useAuth();

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

  // Settings (tab "Configuración") — sin cambios funcionales por ahora.
  const [notifLearning, setNotifLearning] = useState(true);
  const [notifRecommend, setNotifRecommend] = useState(true);
  const [notifAchieve, setNotifAchieve] = useState(true);
  const [notifEmail, setNotifEmail] = useState(false);
  const [showProgress, setShowProgress] = useState(true);
  const [shareData, setShareData] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [savedSettings, setSavedSettings] = useState(false);

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

  const handleSaveSettings = () => {
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2500);
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
              notifLearning={notifLearning}
              notifRecommend={notifRecommend}
              notifAchieve={notifAchieve}
              notifEmail={notifEmail}
              showProgress={showProgress}
              shareData={shareData}
              twoFactor={twoFactor}
              onToggleNotifLearning={() => setNotifLearning((v) => !v)}
              onToggleNotifRecommend={() => setNotifRecommend((v) => !v)}
              onToggleNotifAchieve={() => setNotifAchieve((v) => !v)}
              onToggleNotifEmail={() => setNotifEmail((v) => !v)}
              onToggleShowProgress={() => setShowProgress((v) => !v)}
              onToggleShareData={() => setShareData((v) => !v)}
              onToggleTwoFactor={() => setTwoFactor((v) => !v)}
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
