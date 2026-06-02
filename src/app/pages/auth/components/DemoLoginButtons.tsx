import { GraduationCap, BookOpen, ShieldCheck } from "lucide-react";

interface DemoLoginButtonsProps {
  onDemoLogin: (role: "student" | "teacher" | "admin") => void;
}

const DEMO_ROLES = [
  { role: "student" as const, label: "Estudiante", icon: GraduationCap },
  { role: "teacher" as const, label: "Docente", icon: BookOpen },
  { role: "admin" as const, label: "Admin", icon: ShieldCheck },
];

export function DemoLoginButtons({ onDemoLogin }: DemoLoginButtonsProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground text-center font-medium">Acceso rápido demo</p>
      <div className="flex gap-2">
        {DEMO_ROLES.map(({ role, label, icon: Icon }) => (
          <button
            key={role}
            type="button"
            onClick={() => onDemoLogin(role)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-[10px] text-xs border border-border hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all"
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
