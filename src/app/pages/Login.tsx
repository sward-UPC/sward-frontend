import { useState, useRef, useEffect } from "react";
import {
  Eye, EyeOff, AlertCircle, ArrowLeft, CheckCircle2,
  GraduationCap, BookOpen, BrainCircuit, ShieldCheck,
  ChevronRight, Mail, Lock, RotateCcw, User, Building2,
} from "lucide-react";

interface LoginPageProps {
  onLogin: (role: "student" | "teacher" | "admin") => void;
  onNavigateToRegister?: () => void;
}

type LoginScreen = "login" | "forgot-email" | "forgot-code" | "forgot-newpass" | "forgot-success";

const ROLES = [
  { value: "student" as const, label: "Estudiante", icon: GraduationCap },
  { value: "teacher" as const, label: "Docente", icon: BookOpen },
  { value: "admin" as const, label: "Admin", icon: ShieldCheck },
];

/* ─────────────── OTP Input ─────────────── */
function OTPInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !value[i] && i > 0) inputs.current[i - 1]?.focus();
  };
  const handleChange = (i: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const next = [...value]; next[i] = digit; onChange(next);
    if (digit && i < 5) inputs.current[i + 1]?.focus();
  };
  const handlePaste = (e: React.ClipboardEvent) => {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
    const next = [...value]; digits.forEach((d, i) => { next[i] = d; }); onChange(next);
    inputs.current[Math.min(digits.length, 5)]?.focus(); e.preventDefault();
  };
  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {Array.from({ length: 6 }).map((_, i) => (
        <input key={i} ref={(el) => { inputs.current[i] = el; }} type="text" inputMode="numeric"
          maxLength={1} value={value[i] || ""} onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          className={`w-10 h-11 text-center rounded-[10px] border-2 outline-none transition-all focus:border-primary ${value[i] ? "border-primary bg-primary/5" : "border-border bg-muted/30"}`}
          style={{ fontSize: 18, fontWeight: 600 }} aria-label={`Dígito ${i + 1}`} />
      ))}
    </div>
  );
}

/* ─────────────── Field helper ─────────────── */
function Field({ id, type = "text", value, onChange, placeholder, icon: Icon, right }: any) {
  return (
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />}
      <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} autoComplete="off"
        className={`w-full py-2.5 rounded-[12px] border border-input bg-card/80 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all ${Icon ? "pl-9" : "pl-3"} ${right ? "pr-10" : "pr-3"}`} />
      {right}
    </div>
  );
}

/* ─────────────── Strength bar ─────────────── */
function PasswordStrength({ pw }: { pw: string }) {
  if (!pw) return null;
  const s = (pw.length >= 8 ? 1 : 0) + (/[A-Z]/.test(pw) ? 1 : 0) + (/[0-9]/.test(pw) ? 1 : 0) + (/[^A-Za-z0-9]/.test(pw) ? 1 : 0);
  const colors = ["bg-destructive", "bg-destructive", "bg-warning", "bg-blue-500", "bg-success"];
  const labels = ["", "Débil", "Regular", "Buena", "Fuerte"];
  return (
    <div className="space-y-1 pt-0.5">
      <div className="flex gap-1">{[1,2,3,4].map(l => <div key={l} className={`h-1 flex-1 rounded-full transition-colors ${l <= s ? colors[s] : "bg-muted"}`} />)}</div>
      <p className="text-xs text-muted-foreground">{labels[s]}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export function LoginPage({ onLogin }: LoginPageProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // ── Login state ──
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginRole, setLoginRole] = useState<"student"|"teacher"|"admin">("student");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginScreen, setLoginScreen] = useState<LoginScreen>("login");

  // ── Recovery state ──
  const [recEmail, setRecEmail] = useState("");
  const [recEmailErr, setRecEmailErr] = useState("");
  const [otp, setOtp] = useState(["","","","","",""]);
  const [otpErr, setOtpErr] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);
  const [newPwErr, setNewPwErr] = useState("");
  const [recLoading, setRecLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // ── Register state ──
  const [regStep, setRegStep] = useState(1);
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regInstitution, setRegInstitution] = useState("");
  const [regRole, setRegRole] = useState<"student"|"teacher">("student");
  const [regPw, setRegPw] = useState("");
  const [regConfirmPw, setRegConfirmPw] = useState("");
  const [showRegPw, setShowRegPw] = useState(false);
  const [regErrors, setRegErrors] = useState<Record<string,string>>({});
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  useEffect(() => {
    if (resendTimer > 0) { const t = setTimeout(() => setResendTimer(v => v - 1), 1000); return () => clearTimeout(t); }
  }, [resendTimer]);

  const flip = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsFlipped(f => !f);
    setTimeout(() => setIsAnimating(false), 700);
  };

  // ── Login submit ──
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); setLoginError("");
    if (!loginEmail) { setLoginError("Ingresa tu correo."); return; }
    if (!loginPassword) { setLoginError("Ingresa tu contraseña."); return; }
    setLoginLoading(true);
    setTimeout(() => {
      if (loginEmail !== "demo@sward.edu.pe" || loginPassword !== "demo123") {
        setLoginError("Credenciales incorrectas. Usa demo@sward.edu.pe / demo123");
        setLoginLoading(false); return;
      }
      setLoginLoading(false); onLogin(loginRole);
    }, 1000);
  };

  // ── Recovery ──
  const handleSendCode = () => {
    if (!recEmail) { setRecEmailErr("Ingresa tu correo."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recEmail)) { setRecEmailErr("Correo inválido."); return; }
    setRecEmailErr(""); setRecLoading(true);
    setTimeout(() => { setRecLoading(false); setOtp(["","","","","",""]); setResendTimer(60); setLoginScreen("forgot-code"); }, 1200);
  };
  const handleVerifyCode = () => {
    if (otp.join("").length < 6) { setOtpErr("Ingresa los 6 dígitos."); return; }
    setOtpErr(""); setRecLoading(true);
    setTimeout(() => { setRecLoading(false); setNewPw(""); setConfirmPw(""); setLoginScreen("forgot-newpass"); }, 900);
  };
  const handleSetNewPw = () => {
    if (!newPw) { setNewPwErr("Ingresa una contraseña."); return; }
    if (newPw.length < 8) { setNewPwErr("Mínimo 8 caracteres."); return; }
    if (newPw !== confirmPw) { setNewPwErr("Las contraseñas no coinciden."); return; }
    setNewPwErr(""); setRecLoading(true);
    setTimeout(() => { setRecLoading(false); setLoginScreen("forgot-success"); }, 1000);
  };
  const resetRecovery = () => { setLoginScreen("login"); setRecEmail(""); setRecEmailErr(""); setOtp(["","","","","",""]); setOtpErr(""); setNewPw(""); setConfirmPw(""); setNewPwErr(""); };

  // ── Register step 1 validation ──
  const handleRegStep1 = () => {
    const errs: Record<string,string> = {};
    if (!regName.trim()) errs.name = "Nombre requerido.";
    if (!regEmail) errs.email = "Correo requerido.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)) errs.email = "Correo inválido.";
    if (!regInstitution.trim()) errs.institution = "Institución requerida.";
    if (Object.keys(errs).length) { setRegErrors(errs); return; }
    setRegErrors({}); setRegStep(2);
  };

  // ── Register submit ──
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string,string> = {};
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

  const Spinner = () => (
    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
  );

  /* ─── Shared card styles ─── */
  const faceBase = "absolute inset-0 overflow-y-auto rounded-2xl bg-card/95 backdrop-blur-sm shadow-2xl border border-border/50 p-8 flex flex-col";

  return (
    <div className="min-h-screen w-full flex">

      {/* ══════════ LEFT PANEL — BRANDING ══════════ */}
      <div
        className="hidden lg:flex flex-col justify-between p-10 relative overflow-hidden"
        style={{
          width: "42%",
          background: "linear-gradient(155deg, #312e81 0%, #4338ca 40%, #6d28d9 100%)",
        }}
      >
        {/* Background orbs */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #a5b4fc, transparent)" }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #818cf8, transparent)" }} />

        {/* Logo */}
        <div className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.3)" }}>
            <span className="text-base font-black text-white">S</span>
          </div>
          <span className="font-bold text-lg tracking-tight text-white">SWARD</span>
        </div>

        {/* Hero text */}
        <div className="relative z-10 space-y-6">
          <div>
            <h1 className="text-white leading-tight" style={{ fontSize: "2.4rem", fontWeight: 700, lineHeight: 1.15 }}>
              Aprende con<br />
              <span style={{ color: "#a5b4fc" }}>inteligencia</span><br />
              <span style={{ color: "#c4b5fd" }}>adaptativa.</span>
            </h1>
            <p className="text-indigo-200 mt-4 leading-relaxed" style={{ fontSize: "0.95rem", maxWidth: 320 }}>
              El sistema que entiende cómo aprendes y explica cada recomendación que te hace.
            </p>
          </div>

          {/* Feature badges */}
          <div className="space-y-3.5">
            {[
              { icon: BrainCircuit, label: "IA Explicable", desc: "Comprende el porqué de cada recomendación" },
              { icon: GraduationCap, label: "Adaptativo", desc: "Recursos ajustados a tu nivel real en tiempo real" },
              { icon: ShieldCheck, label: "Trazable", desc: "Cada decisión del modelo es auditable y transparente" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
                  <Icon className="w-4 h-4 text-indigo-200" />
                </div>
                <div>
                  <p className="text-white text-sm" style={{ fontWeight: 600 }}>{label}</p>
                  <p className="text-indigo-300" style={{ fontSize: "0.78rem" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-indigo-400 relative z-10" style={{ fontSize: "0.72rem" }}>
          © 2026 SWARD — WCAG 2.1 AA
        </p>
      </div>

      {/* ══════════ RIGHT PANEL — AUTH CARD ══════════ */}
      <div className="flex-1 flex items-center justify-center p-6 relative bg-[#f5f3ff] dark:bg-[#0f1117]">
        {/* Floating orbs */}
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #818cf8, transparent)" }} />
        <div className="absolute bottom-10 left-10 w-56 h-56 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #6366f1, transparent)" }} />

      {/* ── Flip container ── */}
      <div style={{ width: 420, height: 640, perspective: "1200px", position: "relative", zIndex: 1 }}>
        <div
          style={{
            width: "100%", height: "100%", position: "relative",
            transformStyle: "preserve-3d",
            transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >

          {/* ══════════ FRONT — LOGIN ══════════ */}
          <div className={faceBase} style={{ backfaceVisibility: "hidden" }}>
            {/* Logo — only visible on mobile (left panel hidden on lg+) */}
            <div className="flex lg:hidden items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
                style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
                <span className="text-base font-black text-white">S</span>
              </div>
              <span className="font-bold text-lg tracking-tight">SWARD</span>
            </div>

            {loginScreen === "login" && (
              <div className="flex-1 flex flex-col gap-5">
                <div>
                  <h1 className="text-xl font-bold text-foreground">Bienvenido de vuelta</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">Ingresa tus credenciales para continuar</p>
                </div>

                {/* Role selector */}
                <div className="flex p-1 bg-muted/60 rounded-[12px] gap-1">
                  {ROLES.map(({ value, label, icon: Icon }) => (
                    <button key={value} type="button" onClick={() => setLoginRole(value)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-[10px] text-xs font-medium transition-all ${loginRole === value ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                      <Icon className="w-3.5 h-3.5" />{label}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium" htmlFor="l-email">Correo</label>
                    <Field id="l-email" type="email" value={loginEmail} onChange={(v: string) => { setLoginEmail(v); setLoginError(""); }}
                      placeholder="tu@institución.edu.pe" icon={Mail} />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium" htmlFor="l-pw">Contraseña</label>
                      <button type="button" onClick={() => { setLoginScreen("forgot-email"); setRecEmail(loginEmail); }}
                        className="text-xs text-primary hover:text-primary/70 transition-colors">
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>
                    <Field id="l-pw" type={showLoginPw ? "text" : "password"} value={loginPassword}
                      onChange={(v: string) => { setLoginPassword(v); setLoginError(""); }}
                      placeholder="••••••••" icon={Lock}
                      right={
                        <button type="button" tabIndex={-1} onClick={() => setShowLoginPw(p => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                          {showLoginPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      } />
                  </div>

                  {loginError && (
                    <div className="flex items-center gap-2 p-2.5 rounded-[10px] bg-destructive/8 border border-destructive/20">
                      <AlertCircle className="w-3.5 h-3.5 text-destructive shrink-0" />
                      <p className="text-xs text-destructive">{loginError}</p>
                    </div>
                  )}

                  <button type="submit" disabled={loginLoading}
                    className="w-full h-10 rounded-[12px] text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[.98] disabled:opacity-70"
                    style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
                    {loginLoading ? <><Spinner /> Verificando...</> : <>Ingresar <ChevronRight className="w-4 h-4" /></>}
                  </button>
                </form>

                <div className="text-center text-sm text-muted-foreground mt-auto">
                  ¿No tienes cuenta?{" "}
                  <button onClick={flip} className="text-primary font-semibold hover:text-primary/70 transition-colors">
                    Regístrate
                  </button>
                </div>

                <div className="p-2.5 bg-muted/50 rounded-[10px] border border-border/40 text-center">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Demo:</span> demo@sward.edu.pe · demo123
                  </p>
                </div>
              </div>
            )}

            {/* Forgot — email */}
            {loginScreen === "forgot-email" && (
              <div className="flex-1 flex flex-col gap-5">
                <button onClick={resetRecovery} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground w-fit">
                  <ArrowLeft className="w-3.5 h-3.5" /> Volver
                </button>
                <div>
                  <div className="w-11 h-11 rounded-[12px] bg-primary/10 flex items-center justify-center mb-3">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-bold text-lg">Recuperar contraseña</h2>
                  <p className="text-sm text-muted-foreground mt-1">Te enviaremos un código de 6 dígitos a tu correo.</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Correo electrónico</label>
                  <Field type="email" value={recEmail} onChange={(v: string) => { setRecEmail(v); setRecEmailErr(""); }} placeholder="tu@institución.edu.pe" icon={Mail} />
                  {recEmailErr && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{recEmailErr}</p>}
                </div>
                <button onClick={handleSendCode} disabled={recLoading}
                  className="w-full h-10 rounded-[12px] text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-70"
                  style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
                  {recLoading ? <><Spinner /> Enviando...</> : "Enviar código"}
                </button>
              </div>
            )}

            {/* Forgot — OTP */}
            {loginScreen === "forgot-code" && (
              <div className="flex-1 flex flex-col gap-5">
                <button onClick={() => setLoginScreen("forgot-email")} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground w-fit">
                  <ArrowLeft className="w-3.5 h-3.5" /> Cambiar correo
                </button>
                <div>
                  <div className="w-11 h-11 rounded-[12px] bg-primary/10 flex items-center justify-center mb-3">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-bold text-lg">Verificación</h2>
                  <p className="text-sm text-muted-foreground mt-1">Código enviado a <strong>{recEmail}</strong></p>
                </div>
                <OTPInput value={otp} onChange={setOtp} />
                {otpErr && <p className="text-xs text-destructive text-center flex justify-center items-center gap-1"><AlertCircle className="w-3 h-3" />{otpErr}</p>}
                <button onClick={handleVerifyCode} disabled={recLoading}
                  className="w-full h-10 rounded-[12px] text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-70"
                  style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
                  {recLoading ? <><Spinner /> Verificando...</> : "Verificar código"}
                </button>
                <div className="text-center">
                  {resendTimer > 0
                    ? <p className="text-xs text-muted-foreground">Reenviar en <strong>{resendTimer}s</strong></p>
                    : <button onClick={() => { setResendTimer(60); setOtp(["","","","","",""]); }} className="text-xs text-primary flex items-center gap-1 mx-auto"><RotateCcw className="w-3 h-3" />Reenviar código</button>}
                </div>
                <p className="text-xs text-center text-muted-foreground">Código de prueba: <span className="font-mono font-bold text-foreground">123456</span></p>
              </div>
            )}

            {/* Forgot — new password */}
            {loginScreen === "forgot-newpass" && (
              <div className="flex-1 flex flex-col gap-5">
                <div>
                  <div className="w-11 h-11 rounded-[12px] bg-primary/10 flex items-center justify-center mb-3">
                    <Lock className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-bold text-lg">Nueva contraseña</h2>
                  <p className="text-sm text-muted-foreground mt-1">Mínimo 8 caracteres.</p>
                </div>
                <div className="space-y-3">
                  <Field type={showNewPw ? "text" : "password"} value={newPw}
                    onChange={(v: string) => { setNewPw(v); setNewPwErr(""); }}
                    placeholder="Nueva contraseña" icon={Lock}
                    right={<button type="button" tabIndex={-1} onClick={() => setShowNewPw(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>} />
                  <PasswordStrength pw={newPw} />
                  <Field type="password" value={confirmPw} onChange={(v: string) => { setConfirmPw(v); setNewPwErr(""); }} placeholder="Confirmar contraseña" icon={Lock} />
                  {newPwErr && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{newPwErr}</p>}
                </div>
                <button onClick={handleSetNewPw} disabled={recLoading}
                  className="w-full h-10 rounded-[12px] text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-70"
                  style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
                  {recLoading ? <><Spinner /> Guardando...</> : "Guardar contraseña"}
                </button>
              </div>
            )}

            {/* Forgot — success */}
            {loginScreen === "forgot-success" && (
              <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-success" />
                </div>
                <div>
                  <h2 className="font-bold text-xl">¡Contraseña actualizada!</h2>
                  <p className="text-sm text-muted-foreground mt-1">Ya puedes iniciar sesión con tu nueva contraseña.</p>
                </div>
                <button onClick={resetRecovery}
                  className="w-full h-10 rounded-[12px] text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
                  Ir al inicio de sesión <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* ══════════ BACK — REGISTER ══════════ */}
          <div className={faceBase} style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
            {/* Logo — only visible on mobile */}
            <div className="flex lg:hidden items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
                style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
                <span className="text-base font-black text-white">S</span>
              </div>
              <span className="font-bold text-lg tracking-tight">SWARD</span>
            </div>

            {!regSuccess ? (
              <div className="flex-1 flex flex-col gap-5">
                {/* Header */}
                <div>
                  <h1 className="text-xl font-bold">Crear cuenta</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">Únete a la plataforma de aprendizaje adaptativo</p>
                </div>

                {/* Step indicator */}
                <div className="flex items-center gap-2">
                  {[1, 2].map((s) => (
                    <div key={s} className="flex items-center gap-2 flex-1">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 transition-all duration-300 ${regStep >= s ? "text-white shadow-sm" : "bg-muted text-muted-foreground"}`}
                        style={regStep >= s ? { background: "linear-gradient(135deg, #4f46e5, #7c3aed)", fontWeight: 600 } : {}}>
                        {regStep > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                      </div>
                      <span className={`text-xs transition-colors ${regStep === s ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                        {s === 1 ? "Información" : "Acceso"}
                      </span>
                      {s < 2 && <div className="flex-1 h-px mx-1 rounded-full transition-colors duration-300" style={{ background: regStep > 1 ? "#6366f1" : "#e5e7eb" }} />}
                    </div>
                  ))}
                </div>

                {/* ── Step 1: identity ── */}
                {regStep === 1 && (
                  <div className="flex flex-col gap-4 flex-1">
                    <div className="space-y-3.5">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Nombre completo</label>
                        <Field value={regName} onChange={(v: string) => { setRegName(v); setRegErrors(e => ({ ...e, name: "" })); }}
                          placeholder="María López Suárez" icon={User} />
                        {regErrors.name && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{regErrors.name}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Correo institucional</label>
                        <Field type="email" value={regEmail} onChange={(v: string) => { setRegEmail(v); setRegErrors(e => ({ ...e, email: "" })); }}
                          placeholder="tu@universidad.edu.pe" icon={Mail} />
                        {regErrors.email && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{regErrors.email}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Institución</label>
                        <Field value={regInstitution} onChange={(v: string) => { setRegInstitution(v); setRegErrors(e => ({ ...e, institution: "" })); }}
                          placeholder="Universidad Mayor de San Marcos" icon={Building2} />
                        {regErrors.institution && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{regErrors.institution}</p>}
                      </div>
                    </div>

                    <button type="button" onClick={handleRegStep1}
                      className="w-full h-10 rounded-[12px] text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[.98] mt-auto"
                      style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
                      Siguiente <ChevronRight className="w-4 h-4" />
                    </button>

                    <div className="text-center text-sm text-muted-foreground">
                      ¿Ya tienes cuenta?{" "}
                      <button onClick={flip} className="text-primary font-semibold hover:text-primary/70 transition-colors">
                        Inicia sesión
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Step 2: role + password ── */}
                {regStep === 2 && (
                  <form onSubmit={handleRegister} className="flex flex-col gap-4 flex-1">
                    <div className="space-y-3.5">
                      {/* Role */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Soy</label>
                        <div className="flex gap-2">
                          {[{ v: "student" as const, l: "Estudiante", icon: GraduationCap }, { v: "teacher" as const, l: "Docente", icon: BookOpen }].map(({ v, l, icon: Icon }) => (
                            <button key={v} type="button" onClick={() => setRegRole(v)}
                              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-sm border transition-all ${regRole === v ? "border-primary bg-primary/5 text-primary font-medium" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                              <Icon className="w-4 h-4" />{l}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Password */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Contraseña</label>
                        <Field type={showRegPw ? "text" : "password"} value={regPw}
                          onChange={(v: string) => { setRegPw(v); setRegErrors(e => ({ ...e, pw: "" })); }}
                          placeholder="Mínimo 8 caracteres" icon={Lock}
                          right={<button type="button" tabIndex={-1} onClick={() => setShowRegPw(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showRegPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>} />
                        <PasswordStrength pw={regPw} />
                        {regErrors.pw && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{regErrors.pw}</p>}
                      </div>

                      {/* Confirm password */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Confirmar contraseña</label>
                        <Field type="password" value={regConfirmPw}
                          onChange={(v: string) => { setRegConfirmPw(v); setRegErrors(e => ({ ...e, confirmPw: "" })); }}
                          placeholder="Repite tu contraseña" icon={Lock} />
                        {regErrors.confirmPw && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{regErrors.confirmPw}</p>}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <button type="button" onClick={() => { setRegStep(1); setRegErrors({}); }}
                        className="h-10 px-4 rounded-[12px] text-sm font-medium border border-border text-foreground hover:bg-muted/50 transition-all flex items-center gap-1.5">
                        <ArrowLeft className="w-4 h-4" /> Atrás
                      </button>
                      <button type="submit" disabled={regLoading}
                        className="flex-1 h-10 rounded-[12px] text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[.98] disabled:opacity-70"
                        style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
                        {regLoading ? <><Spinner /> Creando cuenta...</> : "Crear cuenta"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              /* Register success */
              <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-success" />
                </div>
                <div>
                  <h2 className="font-bold text-xl">¡Registro exitoso!</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tu cuenta fue creada correctamente.<br />Redirigiendo al inicio de sesión...
                  </p>
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
