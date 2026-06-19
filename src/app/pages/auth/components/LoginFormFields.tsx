import {
  Eye, EyeOff, AlertCircle, ChevronRight, Mail, Lock,
} from "lucide-react";
import type { LoginScreen } from "../useLoginForm";
import {
  ForgotEmailScreen, ForgotCodeScreen, ForgotNewPassScreen, ForgotSuccessScreen,
} from "./RecoveryScreens";
import { FormField as Field } from "./FormField";

function Spinner() {
  return <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />;
}

interface LoginFormFieldsProps {
  loginScreen: LoginScreen;
  loginEmail: string;
  loginPassword: string;
  showLoginPw: boolean;
  loginRole: "student" | "teacher" | "admin";
  loginError: string;
  loginLoading: boolean;
  recEmail: string;
  recEmailErr: string;
  otp: string[];
  otpErr: string;
  newPw: string;
  confirmPw: string;
  showNewPw: boolean;
  newPwErr: string;
  recLoading: boolean;
  resendTimer: number;
  onLoginEmail: (v: string) => void;
  onLoginPassword: (v: string) => void;
  onShowLoginPw: (v: boolean | ((p: boolean) => boolean)) => void;
  onLoginRole: (v: "student" | "teacher" | "admin") => void;
  onLoginError: (v: string) => void;
  onLoginScreen: (v: LoginScreen) => void;
  onRecEmail: (v: string) => void;
  onRecEmailErr: (v: string) => void;
  onOtp: (v: string[]) => void;
  onNewPw: (v: string) => void;
  onConfirmPw: (v: string) => void;
  onShowNewPw: (v: boolean | ((p: boolean) => boolean)) => void;
  onNewPwErr: (v: string) => void;
  onResendTimer: (v: number | ((p: number) => number)) => void;
  onSubmitLogin: (e: React.FormEvent) => void;
  onSendCode: () => void;
  onVerifyCode: () => void;
  onSetNewPw: () => void;
  onResetRecovery: () => void;
  onFlip: () => void;
}

export function LoginFormFields({
  loginScreen, loginEmail, loginPassword, showLoginPw, loginError, loginLoading,
  recEmail, recEmailErr, otp, otpErr, newPw, confirmPw, showNewPw, newPwErr, recLoading, resendTimer,
  onLoginEmail, onLoginPassword, onShowLoginPw, onLoginError, onLoginScreen,
  onRecEmail, onRecEmailErr, onOtp, onNewPw, onConfirmPw, onShowNewPw, onNewPwErr, onResendTimer,
  onSubmitLogin, onSendCode, onVerifyCode, onSetNewPw, onResetRecovery, onFlip,
}: LoginFormFieldsProps) {
  if (loginScreen === "forgot-email") {
    return <ForgotEmailScreen recEmail={recEmail} recEmailErr={recEmailErr} recLoading={recLoading} onRecEmail={onRecEmail} onRecEmailErr={onRecEmailErr} onSendCode={onSendCode} onResetRecovery={onResetRecovery} />;
  }
  if (loginScreen === "forgot-code") {
    return <ForgotCodeScreen recEmail={recEmail} otp={otp} otpErr={otpErr} recLoading={recLoading} resendTimer={resendTimer} onOtp={onOtp} onVerifyCode={onVerifyCode} onResendTimer={onResendTimer} onLoginScreen={onLoginScreen} />;
  }
  if (loginScreen === "forgot-newpass") {
    return <ForgotNewPassScreen newPw={newPw} confirmPw={confirmPw} showNewPw={showNewPw} newPwErr={newPwErr} recLoading={recLoading} onNewPw={onNewPw} onConfirmPw={onConfirmPw} onShowNewPw={onShowNewPw} onNewPwErr={onNewPwErr} onSetNewPw={onSetNewPw} />;
  }
  if (loginScreen === "forgot-success") {
    return <ForgotSuccessScreen onResetRecovery={onResetRecovery} />;
  }

  return (
    <div className="flex-1 flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">Bienvenido de vuelta</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Ingresa tus credenciales para continuar</p>
      </div>

      <form onSubmit={onSubmitLogin} className="flex flex-col gap-3.5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="l-email">Correo</label>
          <Field id="l-email" type="email" value={loginEmail}
            onChange={(v: string) => { onLoginEmail(v); onLoginError(""); }}
            placeholder="tu@institución.edu.pe" icon={Mail} />
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium" htmlFor="l-pw">Contraseña</label>
            <button type="button" onClick={() => { onLoginScreen("forgot-email"); onRecEmail(loginEmail); }}
              className="text-xs text-primary hover:text-primary/70 transition-colors">
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          <Field id="l-pw" type={showLoginPw ? "text" : "password"} value={loginPassword}
            onChange={(v: string) => { onLoginPassword(v); onLoginError(""); }}
            placeholder="••••••••" icon={Lock}
            right={
              <button type="button" tabIndex={-1} onClick={() => onShowLoginPw((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showLoginPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
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
        <button onClick={onFlip} className="text-primary font-semibold hover:text-primary/70 transition-colors">Regístrate</button>
      </div>
    </div>
  );
}
