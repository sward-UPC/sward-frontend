import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronRight, AlertCircle, Mail } from "lucide-react";
import { LoginBranding, LoginFormFields, useLoginForm } from "./auth";
import { FormField as Field } from "./auth/components/FormField";
import { useAuth } from "@core/auth/useAuth";
import { login as loginService } from "@features/auth/services/auth.service";

interface LoginPageProps {
  onLogin?: (role: "student" | "teacher" | "admin") => void;
  onNavigateToRegister?: () => void;
}

/**
 * Apaga una cara de la tarjeta para el teclado y el lector de pantalla. El
 * proyecto corre React 18, que no conoce «inert» como booleano (React 19 sí),
 * así que se manda como atributo de texto; el cast es para eso.
 */
function inerte(apagada: boolean): React.HTMLAttributes<HTMLDivElement> {
  return (apagada
    ? { inert: '', 'aria-hidden': true }
    : {}) as React.HTMLAttributes<HTMLDivElement>;
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

  // /register redirige aquí con ?registro=1: había dos pantallas de registro
  // distintas y quedó esta, la del mismo diseño que el ingreso.
  const [isFlipped, setIsFlipped] = useState(
    () => new URLSearchParams(window.location.search).get("registro") === "1"
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [regEmail, setRegEmail] = useState("");
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});

  const form = useLoginForm();

  const flip = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsFlipped((f) => !f);
    setTimeout(() => setIsAnimating(false), 700);
  };

  // Este panel pedía sólo correo y contraseña, porque la cuenta ya tenía que
  // existir en la plataforma educativa: la creaba un script externo a partir de
  // un formulario. Desde el 24-sep-2026 el registro da de alta al participante y
  // recoge su consentimiento informado, que necesita su propia pantalla.
  //
  // Hasta el 26-sep-2026 esto tenía dos pasos —correo, y luego contraseña con su
  // confirmación— y al final **descartaba la contraseña** y continuaba en
  // /registro, que volvía a pedir correo y contraseña desde cero. El participante
  // escribía las dos cosas dos veces, en dos diseños distintos. Ahora este panel
  // sólo toma el correo y lleva a la inscripción con él ya escrito: una sola vez
  // cada dato, y el consentimiento en la misma pantalla que los recoge.
  const handleRegStep1 = () => {
    const errs: Record<string, string> = {};
    if (!regEmail) errs.email = "Correo requerido.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)) errs.email = "Correo inválido.";
    if (Object.keys(errs).length) { setRegErrors(errs); return; }
    setRegErrors({});
    navigate(`/registro?correo=${encodeURIComponent(regEmail)}`);
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

            {/* FRONT — LOGIN. La cara que no se ve queda inerte: sin eso, el
                tabulador y el lector de pantalla entran en el formulario de
                atrás, que está en el DOM pero volteado. React 18 no conoce
                «inert», así que se pasa como cadena vacía (o se omite). */}
            <div className={faceBase} style={faceStyle} {...inerte(isFlipped)}>
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
                onNewPwErr={form.setNewPwErr} onResendCode={form.handleResendCode}
                onSubmitLogin={(e) => form.handleLogin(e, handleLoginSuccess)}
                onSendCode={form.handleSendCode} onVerifyCode={form.handleVerifyCode}
                onSetNewPw={form.handleSetNewPw} onResetRecovery={form.resetRecovery} onFlip={flip}
              />
              </div>
            </div>

            {/* BACK — REGISTER */}
            <div className={faceBase} style={{ ...faceStyle, transform: "rotateY(180deg)" }} {...inerte(!isFlipped)}>
              <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
              {mobileLogo}
              <div className="flex-1 flex flex-col gap-8">
                  <div className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Crea tu cuenta</h1>
                    <p className="text-sm text-muted-foreground">Únete a la plataforma de aprendizaje adaptativo.</p>
                  </div>
                    <div className="flex flex-col gap-5 flex-1">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium" htmlFor="r-email">Correo</label>
                        <Field id="r-email" type="email" value={regEmail} autoComplete="email" invalid={!!regErrors.email}
                          describedBy={regErrors.email ? "r-email-err" : undefined}
                          onChange={(v: string) => { setRegEmail(v); setRegErrors((e) => ({ ...e, email: "" })); }} placeholder="tucorreo@mail.com" icon={Mail} />
                        {regErrors.email && <p id="r-email-err" role="alert" className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{regErrors.email}</p>}
                        <p className="text-xs text-muted-foreground">Usa un correo que revises: por ahí llega tu acceso al aula virtual.</p>
                      </div>
                      <button type="button" onClick={handleRegStep1} className="w-full h-12 rounded-xl text-base font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-primary/20 active:scale-[.99] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-card mt-auto" style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
                        Siguiente <ChevronRight className="w-4 h-4" />
                      </button>
                      <div className="text-center text-sm text-muted-foreground pt-1">
                        ¿Ya tienes cuenta?{" "}
                        <button onClick={flip} className="text-primary font-semibold hover:text-primary/70 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded">Inicia sesión</button>
                      </div>
                    </div>
              </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
