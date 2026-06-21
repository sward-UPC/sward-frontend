import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, CheckCircle2, ChevronRight, AlertCircle, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { LoginBranding, LoginFormFields, useLoginForm } from "./auth";
import { FormField as Field } from "./auth/components/FormField";
import { useAuth } from "@core/auth/useAuth";
import { login as loginService, register as registerService } from "@features/auth/services/auth.service";

interface LoginPageProps {
  onLogin?: (role: "student" | "teacher" | "admin") => void;
  onNavigateToRegister?: () => void;
}

/* Register form is part of the flip card — kept inline to share flip/animation state */
function Spinner() {
  return <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLoginSuccess = async (correo: string, password: string) => {
    const response = await loginService({ correo, password });
    await login(response);
    // Navegar al dashboard según el rol del perfil cargado
    const storedUser = localStorage.getItem('sward_user');
    const parsedUser = storedUser ? (JSON.parse(storedUser) as { role?: string }) : null;
    const role = (parsedUser?.role ?? "student") as "student" | "teacher" | "admin";
    navigate(`/${role}`);
    onLogin?.(role);
  };

  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [regStep, setRegStep] = useState(1);
  const [regEmail, setRegEmail] = useState("");
  const [regPw, setRegPw] = useState("");
  const [regConfirmPw, setRegConfirmPw] = useState("");
  const [showRegPw, setShowRegPw] = useState(false);
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [regApiError, setRegApiError] = useState("");

  const form = useLoginForm();

  const flip = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsFlipped((f) => !f);
    setTimeout(() => setIsAnimating(false), 700);
  };

  const handleRegStep1 = () => {
    const errs: Record<string, string> = {};
    if (!regEmail) errs.email = "Correo requerido.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)) errs.email = "Correo inválido.";
    if (Object.keys(errs).length) { setRegErrors(errs); return; }
    setRegErrors({}); setRegStep(2);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!regPw) errs.pw = "Contraseña requerida.";
    else if (regPw.length < 8) errs.pw = "Mínimo 8 caracteres.";
    if (regPw !== regConfirmPw) errs.confirmPw = "Las contraseñas no coinciden.";
    if (Object.keys(errs).length) { setRegErrors(errs); return; }
    setRegErrors({}); setRegApiError(""); setRegLoading(true);
    try {
      await registerService({ correo: regEmail, password: regPw });
      setRegLoading(false);
      setRegSuccess(true);
      setTimeout(() => { setRegSuccess(false); setRegStep(1); setRegEmail(""); setRegPw(""); setRegConfirmPw(""); flip(); }, 2000);
    } catch (err: unknown) {
      setRegLoading(false);
      const message = err instanceof Error ? err.message : "Error al crear la cuenta. Intenta nuevamente.";
      setRegApiError(message);
    }
  };

  // Sin overflow en la cara 3D: un elemento con backface-visibility:hidden y
  // overflow!=visible "aplana" el render y deja ver la cara de atrás (se veía el
  // login detrás del registro). El scroll va en un wrapper interno.
  const faceBase = "absolute inset-0 rounded-2xl bg-card shadow-2xl border border-border/60 p-8 sm:p-10 flex flex-col";
  const faceStyle: React.CSSProperties = {
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
  };
  const mobileLogo = (
    <div className="flex lg:hidden items-center gap-2.5 mb-8">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md" style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
        <span className="text-lg font-black text-white">S</span>
      </div>
      <span className="font-bold text-lg tracking-tight">SWARD</span>
    </div>
  );

  return (
    <div className="min-h-dvh w-full flex">
      <LoginBranding />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 relative bg-[#f5f3ff] dark:bg-[#0f1117] overflow-hidden">
        <div aria-hidden className="absolute -top-16 -right-16 w-72 h-72 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #818cf8, transparent)" }} />

        <div className="w-full" style={{ maxWidth: 420, height: "min(640px, calc(100dvh - 64px))", perspective: "1200px", position: "relative", zIndex: 1 }}>
          <div style={{ width: "100%", height: "100%", position: "relative", transformStyle: "preserve-3d", transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)", transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>

            {/* FRONT — LOGIN */}
            <div className={faceBase} style={faceStyle}>
              <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
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
                onSubmitLogin={(e) => form.handleLogin(e, handleLoginSuccess)}
                onSendCode={form.handleSendCode} onVerifyCode={form.handleVerifyCode}
                onSetNewPw={form.handleSetNewPw} onResetRecovery={form.resetRecovery} onFlip={flip}
              />
              </div>
            </div>

            {/* BACK — REGISTER */}
            <div className={faceBase} style={{ ...faceStyle, transform: "rotateY(180deg)" }}>
              <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
              {mobileLogo}
              {!regSuccess ? (
                <div className="flex-1 flex flex-col gap-8">
                  <div className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Crea tu cuenta</h1>
                    <p className="text-sm text-muted-foreground">Únete a la plataforma de aprendizaje adaptativo.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {[1, 2].map((s) => (
                      <div key={s} className="flex items-center gap-2 flex-1">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 transition-all duration-300 ${regStep >= s ? "text-white shadow-sm" : "bg-muted text-muted-foreground"}`}
                          style={regStep >= s ? { background: "linear-gradient(135deg, #4f46e5, #7c3aed)", fontWeight: 600 } : {}}>
                          {regStep > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                        </div>
                        <span className={`text-xs transition-colors ${regStep === s ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s === 1 ? "Información" : "Acceso"}</span>
                        {s < 2 && <div className={`flex-1 h-px mx-1 rounded-full transition-colors duration-300 ${regStep > 1 ? "bg-primary" : "bg-border"}`} />}
                      </div>
                    ))}
                  </div>
                  {regStep === 1 && (
                    <div className="flex flex-col gap-5 flex-1">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium" htmlFor="r-email">Correo institucional</label>
                        <Field id="r-email" type="email" value={regEmail} autoComplete="email" invalid={!!regErrors.email}
                          describedBy={regErrors.email ? "r-email-err" : undefined}
                          onChange={(v: string) => { setRegEmail(v); setRegErrors((e) => ({ ...e, email: "" })); }} placeholder="tu@universidad.edu.pe" icon={Mail} />
                        {regErrors.email && <p id="r-email-err" role="alert" className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{regErrors.email}</p>}
                      </div>
                      <button type="button" onClick={handleRegStep1} className="w-full h-12 rounded-xl text-base font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-primary/20 active:scale-[.99] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-card mt-auto" style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
                        Siguiente <ChevronRight className="w-4 h-4" />
                      </button>
                      <div className="text-center text-sm text-muted-foreground pt-1">
                        ¿Ya tienes cuenta?{" "}
                        <button onClick={flip} className="text-primary font-semibold hover:text-primary/70 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded">Inicia sesión</button>
                      </div>
                    </div>
                  )}
                  {regStep === 2 && (
                    <form onSubmit={handleRegister} className="flex flex-col gap-5 flex-1" noValidate>
                      <div className="space-y-5">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium" htmlFor="r-pw">Contraseña</label>
                          <Field id="r-pw" type={showRegPw ? "text" : "password"} value={regPw} autoComplete="new-password" invalid={!!regErrors.pw}
                            describedBy={regErrors.pw ? "r-pw-err" : undefined}
                            onChange={(v: string) => { setRegPw(v); setRegErrors((e) => ({ ...e, pw: "" })); }} placeholder="Mínimo 8 caracteres" icon={Lock}
                            right={<button type="button" tabIndex={-1} onClick={() => setShowRegPw((p) => !p)} aria-label={showRegPw ? "Ocultar contraseña" : "Mostrar contraseña"} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors cursor-pointer">{showRegPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>} />
                          {regErrors.pw && <p id="r-pw-err" role="alert" className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{regErrors.pw}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium" htmlFor="r-confirm">Confirmar contraseña</label>
                          <Field id="r-confirm" type={showRegPw ? "text" : "password"} value={regConfirmPw} autoComplete="new-password" invalid={!!regErrors.confirmPw}
                            describedBy={regErrors.confirmPw ? "r-confirm-err" : undefined}
                            onChange={(v: string) => { setRegConfirmPw(v); setRegErrors((e) => ({ ...e, confirmPw: "" })); }} placeholder="Repite tu contraseña" icon={Lock} />
                          {regErrors.confirmPw && <p id="r-confirm-err" role="alert" className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{regErrors.confirmPw}</p>}
                        </div>
                        {regApiError && (
                          <div role="alert" className="flex items-center gap-2 p-3 rounded-xl bg-destructive/8 border border-destructive/20">
                            <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                            <p className="text-xs text-destructive">{regApiError}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2.5 mt-auto">
                        <button type="button" onClick={() => { setRegStep(1); setRegErrors({}); setRegApiError(""); }} className="h-12 px-4 rounded-xl text-sm font-medium border border-border text-foreground hover:bg-muted/50 transition-all flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
                          <ArrowLeft className="w-4 h-4" /> Atrás
                        </button>
                        <button type="submit" disabled={regLoading} className="flex-1 h-12 rounded-xl text-base font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-primary/20 active:scale-[.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-card" style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
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
    </div>
  );
}
