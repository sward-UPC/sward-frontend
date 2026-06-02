import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { ProfileStats } from "./profile/ProfileStats";
import { ProfileEditForm } from "./profile/ProfileEditForm";
import { ProfileAchievements } from "./profile/ProfileAchievements";

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

export function ProfileDialog({ open, onClose, user, initialTab = "profile" }: ProfileDialogProps) {
  // Profile state
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [institution, setInstitution] = useState(user.institution);
  const [bio, setBio] = useState(
    user.bio || "Estudiante apasionado por la Inteligencia Artificial y el Machine Learning."
  );
  const [avatarColor, setAvatarColor] = useState("#4F46E5");
  const [savedProfile, setSavedProfile] = useState(false);

  // Notification toggles
  const [notifLearning, setNotifLearning] = useState(true);
  const [notifRecommend, setNotifRecommend] = useState(true);
  const [notifAchieve, setNotifAchieve] = useState(true);
  const [notifEmail, setNotifEmail] = useState(false);

  // Privacy toggles
  const [showProgress, setShowProgress] = useState(true);
  const [shareData, setShareData] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [savedSettings, setSavedSettings] = useState(false);

  const handleSaveProfile = () => {
    setSavedProfile(true);
    setTimeout(() => setSavedProfile(false), 2500);
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
              name={name}
              role={user.role}
              memberSince={user.memberSince}
              avatarColor={avatarColor}
              onAvatarColorChange={setAvatarColor}
            />
            <ProfileEditForm
              name={name}
              email={email}
              institution={institution}
              bio={bio}
              onNameChange={setName}
              onEmailChange={setEmail}
              onInstitutionChange={setInstitution}
              onBioChange={setBio}
              onSave={handleSaveProfile}
              onCancel={onClose}
              savedProfile={savedProfile}
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
