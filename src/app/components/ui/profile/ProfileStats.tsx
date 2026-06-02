import { Badge } from "../badge";
import { Camera, Check, BookOpen, User } from "lucide-react";
import { Label } from "../label";

interface ProfileStatsProps {
  name: string;
  role: string;
  memberSince: string;
  avatarColor: string;
  onAvatarColorChange: (color: string) => void;
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

export function ProfileStats({
  name,
  role,
  memberSince,
  avatarColor,
  onAvatarColorChange,
}: ProfileStatsProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
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
          <Label className="text-sm font-medium mb-2 block">Color de avatar</Label>
          <div className="flex gap-2 flex-wrap">
            {AVATAR_COLORS.map((c) => (
              <button
                key={c.bg}
                onClick={() => onAvatarColorChange(c.bg)}
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

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="gap-1.5">
          <BookOpen className="w-3 h-3" /> 12 recursos completados
        </Badge>
        <Badge variant="outline" className="gap-1.5">
          <User className="w-3 h-3" /> {role}
        </Badge>
        <Badge variant="outline" className="gap-1.5 text-muted-foreground">
          Desde {memberSince}
        </Badge>
      </div>
    </>
  );
}
