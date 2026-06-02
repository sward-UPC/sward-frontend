import { useState } from "react";
import { ArrowLeft, CheckCircle2, GraduationCap, BookOpen, ChevronRight, AlertCircle, Mail, Lock, Eye, EyeOff, User, Building2 } from "lucide-react";
import { LoginBranding, LoginFormFields, useLoginForm } from "./auth";

interface LoginPageProps {
  onLogin: (role: "student" | "teacher" | "admin") => void;
  onNavigateToRegister?: () => void;
}

/* Register form is part of the flip card — kept inline to share flip/animation state */
function Spinner() {
  return <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />;
}

function Field({ id, type = "text", value, onChange, placeholder, icon: Icon, right }: any) {
  return (
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />}
      <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoComplete="off"
        className={`w-full py-2.5 rounded-[12px] border border-input bg-card/80 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all ${Icon ? "pl-9" : "pl-3"} ${right ? "pr-10" : "pr-3"}`} />
      {right}
    </div>
  );
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [regStep, setRegStep] = useState(1);
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regInstitution, setRegInstitution] = useState("");
  const [regRole, setRegRole] = useState<"student" | "teacher">("student");
  const [regPw, setRegPw] = useState("");
  const [regConfirmPw, setRegConfirmPw] = useState("");
  const [showRegPw, setShowRegPw] = useState(false);
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  const form = useLoginForm();

  const flip = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsFlipped((f) => !f);
    setTimeout(() => setIsAnimating(false), 700);
  };

  const handleRegStep1 = () => {
    const errs: Record<string, string> = {};
    if (!regName.trim()) errs.name = "Nombre requerido.";
    if (!regEmail) errs.email = "Correo requerido.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)) errs.email = "Correo inválido.";
    if (!regInstitution.trim()) errs.institution = "Institución requerida.";
    if (Object.keys(errs).length) { setRegErrors(errs); return; }
    setRegErrors({}); setRegStep(2);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!regPw) errs.pw = "Contraseña requerida.";
    else if (regPw.length < 8) errs.pw = "Mínimo 8 caracteres.";
    if (regPw !== regConfirmPw) errs.confirmPw = "Las contraseñas no coinciden.";
    if (Object.keys(errs).length) { setRegErrors(errs); return; }
    setRegErrors({}); setRegLoading(true);
    setTimeout(() => {
      setRegLoading(false); setRegSuccess(true);
      setTimeout(() => { setRegSuccess(false); setRegStep(1); flip(); }, 2000);
    }, 1500);
  };

  const faceBase = "absolute inset-0 overflow-y-auto rounded-2xl bg-card/95 backdrop-blur-sm shadow-2xl border border-border/50 p-8 flex flex-col";
  const mobileLogo = (
    <div className="flex lg:hidden items-center gap-2.5 mb-5">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md" style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
        <span className="text-base font-black text-white">S</span>
      </div>
      <span className="font-bold text-lg tracking-tight">SWARD</span>
    </div>
  );

  return (
    <div className="min-h-screen w-full flex">
      <LoginBranding />

      <div className="flex-1 flex items-center justify-center p-6 relative bg-[#f5f3ff] dark:bg-[#0f1117]">
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #818cf8, transparent)" }} />
        <div className="absolute bottom-10 left-10 w-56 h-56 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #6366f1, transparent)" }} />

        <div style={{ width: 420, height: 640, perspective: "1200px", position: "relative", zIndex: 1 }}>
          <div style={{ width: "100%", height: "100%", position: "relative", transformStyle: "preserve-3d", transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)", transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>

            {/* FRONT — LOGIN */}
            <div className={faceBase} style={{ backfaceVisibility: "hidden" }}>
              {mobileLogo}
              <LoginFormFields
                loginScreen={form.loginScreen} loginEmail={form.loginEmail} loginPassword={form.loginPassword}
                showLoginPw={form.showLoginPw} loginRole={form.loginRole} loginError={form.loginError}
                loginLoading={form.loginLoading} recEmail={form.recEmail} recEmailErr={form.recEmailErr}
                otp={form.otp} otpErr={form.otpErr} newPw={form.newPw} confirmPw={form.confirmPw}
                showNewPw={form.showNewPw} newPwErr={form.newPwErr} recLoading={form.recLoading} resendTimer={form.resendTimer}
                onLoginEmail={form.setLoginEmail} onLoginPassword={form.setLoginPassword} onShowLoginPw={form.setShowLoginPw}
                onLoginRole={form.setLoginRole} onLoginError={form.setLoginError} onLoginScreen={form.setLoginScreen}
                onRecEmail={form.setRecEmail} onRecEmailErr={form.setRecEmailErr} onOtp={form.setOtp}
                onNewPw={form.setNewPw} onConfirmPw={form.setConfirmPw} onShowNewPw={form.setShowNewPw}
                onNewPwErr={form.setNewPwErr} onResendTimer={form.setResendTimer}
                onSubmitLogin={(e) => form.handleLogin(e, onLogin)}
                onSendCode={form.handleSendCode} onVerifyCode={form.handleVerifyCode}
                onSetNewPw={form.handleSetNewPw} onResetRecovery={form.resetRecovery} onFlip={flip}
              />
            </div>

            {/* BACK — REGISTER */}
            <div className={faceBase} style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
              {mobileLogo}
              {!regSuccess ? (
                <div className="flex-1 flex flex-col gap-5">
                  <div>
                    <h1 className="text-xl font-bold">Crear cuenta</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">Únete a la plataforma de aprendizaje adaptativo</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {[1, 2].map((s) => (
                      <div key={s} className="flex items-center gap-2 flex-1">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 transition-all duration-300 ${regStep >= s ? "text-white shadow-sm" : "bg-muted text-muted-foreground"}`}
                          style={regStep >= s ? { background: "linear-gradient(135deg, #4f46e5, #7c3aed)", fontWeight: 600 } : {}}>
                          {regStep > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                        </div>
                        <span className={`text-xs transition-colors ${regStep === s ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s === 1 ? "Información" : "Acceso"}</span>
                        {s < 2 && <div className="flex-1 h-px mx-1 rounded-full transition-colors duration-300" style={{ background: regStep > 1 ? "#6366f1" : "#e5e7eb" }} />}
                      </div>
                    ))}
                  </div>
                  {regStep === 1 && (
                    <div className="flex flex-col gap-4 flex-1">
                      <div className="space-y-3.5">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium">Nombre completo</label>
                          <Field value={regName} onChange={(v: string) => { setRegName(v); setRegErrors((e) => ({ ...e, name: "" })); }} placeholder="María López Suárez" icon={User} />
                          {regErrors.name && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{regErrors.name}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium">Correo institucional</label>
                          <Field type="email" value={regEmail} onChange={(v: string) => { setRegEmail(v); setRegErrors((e) => ({ ...e, email: "" })); }} placeholder="tu@universidad.edu.pe" icon={Mail} />
                          {regErrors.email && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{regErrors.email}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium">Institución</label>
                          <Field value={regInstitution} onChange={(v: string) => { setRegInstitution(v); setRegErrors((e) => ({ ...e, institution: "" })); }} placeholder="Universidad Mayor de San Marcos" icon={Building2} />
                          {regErrors.institution && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{regErrors.institution}</p>}
                        </div>
                      </div>
                      <button type="button" onClick={handleRegStep1} className="w-full h-10 rounded-[12px] text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[.98] mt-auto" style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
                        Siguiente <ChevronRight className="w-4 h-4" />
                      </button>
                      <div className="text-center text-sm text-muted-foreground">
                        ¿Ya tienes cuenta?{" "}
                        <button onClick={flip} className="text-primary font-semibold hover:text-primary/70 transition-colors">Inicia sesión</button>
                      </div>
                    </div>
                  )}
                  {regStep === 2 && (
                    <form onSubmit={handleRegister} className="flex flex-col gap-4 flex-1">
                      <div className="space-y-3.5">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium">Soy</label>
                          <div className="flex gap-2">
                            {[{ v: "student" as const, l: "Estudiante", icon: GraduationCap }, { v: "teacher" as const, l: "Docente", icon: BookOpen }].map(({ v, l, icon: Icon }) => (
                              <button key={v} type="button" onClick={() => setRegRole(v)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-sm border transition-all ${regRole === v ? "border-primary bg-primary/5 text-primary font-medium" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                                <Icon className="w-4 h-4" />{l}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium">Contraseña</label>
                          <Field type={showRegPw ? "text" : "password"} value={regPw} onChange={(v: string) => { setRegPw(v); setRegErrors((e) => ({ ...e, pw: "" })); }} placeholder="Mínimo 8 caracteres" icon={Lock}
                            right={<button type="button" tabIndex={-1} onClick={() => setShowRegPw((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showRegPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>} />
                          {regErrors.pw && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{regErrors.pw}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium">Confirmar contraseña</label>
                          <Field type="password" value={regConfirmPw} onChange={(v: string) => { setRegConfirmPw(v); setRegErrors((e) => ({ ...e, confirmPw: "" })); }} placeholder="Repite tu contraseña" icon={Lock} />
                          {regErrors.confirmPw && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{regErrors.confirmPw}</p>}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-auto">
                        <button type="button" onClick={() => { setRegStep(1); setRegErrors({}); }} className="h-10 px-4 rounded-[12px] text-sm font-medium border border-border text-foreground hover:bg-muted/50 transition-all flex items-center gap-1.5">
                          <ArrowLeft className="w-4 h-4" /> Atrás
                        </button>
                        <button type="submit" disabled={regLoading} className="flex-1 h-10 rounded-[12px] text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[.98] disabled:opacity-70" style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
                          {regLoading ? <><Spinner /> Creando cuenta...</> : "Crear cuenta"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-success" />
                  </div>
                  <div>
                    <h2 className="font-bold text-xl">¡Registro exitoso!</h2>
                    <p className="text-sm text-muted-foreground mt-1">Tu cuenta fue creada correctamente.<br />Redirigiendo al inicio de sesión...</p>
                  </div>
                  <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
