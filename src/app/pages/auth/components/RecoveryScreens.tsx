import { useRef } from "react";
import {
  Eye, EyeOff, AlertCircle, ChevronRight, CheckCircle2,
  ShieldCheck, Mail, Lock, RotateCcw, ArrowLeft,
} from "lucide-react";
import type { LoginScreen } from "../useLoginForm";
import { FormField as Field } from "./FormField";

function PasswordStrength({ pw }: { pw: string }) {
  if (!pw) return null;
  const s = (pw.length >= 8 ? 1 : 0) + (/[A-Z]/.test(pw) ? 1 : 0) + (/[0-9]/.test(pw) ? 1 : 0) + (/[^A-Za-z0-9]/.test(pw) ? 1 : 0);
  const colors = ["bg-destructive", "bg-destructive", "bg-warning", "bg-blue-500", "bg-success"];
  const labels = ["", "Débil", "Regular", "Buena", "Fuerte"];
  return (
    <div className="space-y-1 pt-0.5">
      <div className="flex gap-1">{[1, 2, 3, 4].map((l) => <div key={l} className={`h-1 flex-1 rounded-full transition-colors ${l <= s ? colors[s] : "bg-muted"}`} />)}</div>
      <p className="text-xs text-muted-foreground">{labels[s]}</p>
    </div>
  );
}

export function OTPInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
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
          className={`w-10 h-12 text-center rounded-[10px] border-2 outline-none transition-all focus:border-primary ${value[i] ? "border-primary bg-primary/5" : "border-border bg-muted/30"}`}
          style={{ fontSize: 18, fontWeight: 600 }} aria-label={`Dígito ${i + 1}`} />
      ))}
    </div>
  );
}

function Spinner() {
  return <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />;
}

function PrimaryBtn({ onClick, disabled, children }: { onClick?: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button type={onClick ? "button" : "submit"} onClick={onClick} disabled={disabled}
      className="w-full h-12 rounded-xl text-base font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-primary/20 active:scale-[.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-card"
      style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
      {children}
    </button>
  );
}

const backBtnClass = "flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded";

/* ─── Recovery: Email step ─── */
interface ForgotEmailProps {
  recEmail: string;
  recEmailErr: string;
  recLoading: boolean;
  onRecEmail: (v: string) => void;
  onRecEmailErr: (v: string) => void;
  onSendCode: () => void;
  onResetRecovery: () => void;
}

export function ForgotEmailScreen({ recEmail, recEmailErr, recLoading, onRecEmail, onRecEmailErr, onSendCode, onResetRecovery }: ForgotEmailProps) {
  return (
    <div className="flex-1 flex flex-col gap-6">
      <button onClick={onResetRecovery} className={backBtnClass}>
        <ArrowLeft className="w-3.5 h-3.5" /> Volver
      </button>
      <div>
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-3"><Mail className="w-5 h-5 text-primary" /></div>
        <h2 className="font-bold text-lg">Recuperar contraseña</h2>
        <p className="text-sm text-muted-foreground mt-1">Te enviaremos un código de 6 dígitos a tu correo.</p>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium" htmlFor="rec-email">Correo electrónico</label>
        <Field id="rec-email" type="email" value={recEmail} autoComplete="email" invalid={!!recEmailErr}
          describedBy={recEmailErr ? "rec-email-err" : undefined}
          onChange={(v: string) => { onRecEmail(v); onRecEmailErr(""); }} placeholder="tu@institución.edu.pe" icon={Mail} />
        {recEmailErr && <p id="rec-email-err" role="alert" className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{recEmailErr}</p>}
      </div>
      <PrimaryBtn onClick={onSendCode} disabled={recLoading}>
        {recLoading ? <><Spinner /> Enviando...</> : "Enviar código"}
      </PrimaryBtn>
    </div>
  );
}

/* ─── Recovery: OTP step ─── */
interface ForgotCodeProps {
  recEmail: string;
  otp: string[];
  otpErr: string;
  recLoading: boolean;
  resendTimer: number;
  onOtp: (v: string[]) => void;
  onVerifyCode: () => void;
  onResendTimer: (v: number | ((p: number) => number)) => void;
  onLoginScreen: (v: LoginScreen) => void;
}

export function ForgotCodeScreen({ recEmail, otp, otpErr, recLoading, resendTimer, onOtp, onVerifyCode, onResendTimer, onLoginScreen }: ForgotCodeProps) {
  return (
    <div className="flex-1 flex flex-col gap-6">
      <button onClick={() => onLoginScreen("forgot-email")} className={backBtnClass}>
        <ArrowLeft className="w-3.5 h-3.5" /> Cambiar correo
      </button>
      <div>
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-3"><ShieldCheck className="w-5 h-5 text-primary" /></div>
        <h2 className="font-bold text-lg">Verificación</h2>
        <p className="text-sm text-muted-foreground mt-1">Código enviado a <strong>{recEmail}</strong></p>
      </div>
      <OTPInput value={otp} onChange={onOtp} />
      {otpErr && <p role="alert" className="text-xs text-destructive text-center flex justify-center items-center gap-1"><AlertCircle className="w-3 h-3" />{otpErr}</p>}
      <PrimaryBtn onClick={onVerifyCode} disabled={recLoading}>
        {recLoading ? <><Spinner /> Verificando...</> : "Verificar código"}
      </PrimaryBtn>
      <div className="text-center">
        {resendTimer > 0
          ? <p className="text-xs text-muted-foreground">Reenviar en <strong>{resendTimer}s</strong></p>
          : <button onClick={() => { onResendTimer(60); onOtp(["", "", "", "", "", ""]); }} className="text-xs font-medium text-primary hover:text-primary/70 transition-colors flex items-center gap-1 mx-auto cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded"><RotateCcw className="w-3 h-3" />Reenviar código</button>}
      </div>
      <p className="text-xs text-center text-muted-foreground">Código de prueba: <span className="font-mono font-bold text-foreground">123456</span></p>
    </div>
  );
}

/* ─── Recovery: New password step ─── */
interface ForgotNewPassProps {
  newPw: string;
  confirmPw: string;
  showNewPw: boolean;
  newPwErr: string;
  recLoading: boolean;
  onNewPw: (v: string) => void;
  onConfirmPw: (v: string) => void;
  onShowNewPw: (v: boolean | ((p: boolean) => boolean)) => void;
  onNewPwErr: (v: string) => void;
  onSetNewPw: () => void;
}

export function ForgotNewPassScreen({ newPw, confirmPw, showNewPw, newPwErr, recLoading, onNewPw, onConfirmPw, onShowNewPw, onNewPwErr, onSetNewPw }: ForgotNewPassProps) {
  return (
    <div className="flex-1 flex flex-col gap-6">
      <div>
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-3"><Lock className="w-5 h-5 text-primary" /></div>
        <h2 className="font-bold text-lg">Nueva contraseña</h2>
        <p className="text-sm text-muted-foreground mt-1">Mínimo 8 caracteres.</p>
      </div>
      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="rec-newpw">Nueva contraseña</label>
          <Field id="rec-newpw" type={showNewPw ? "text" : "password"} value={newPw} autoComplete="new-password" invalid={!!newPwErr}
            onChange={(v: string) => { onNewPw(v); onNewPwErr(""); }}
            placeholder="Nueva contraseña" icon={Lock}
            right={<button type="button" tabIndex={-1} onClick={() => onShowNewPw((p) => !p)} aria-label={showNewPw ? "Ocultar contraseña" : "Mostrar contraseña"} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors cursor-pointer">{showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>}
          />
          <PasswordStrength pw={newPw} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="rec-confirmpw">Confirmar contraseña</label>
          <Field id="rec-confirmpw" type={showNewPw ? "text" : "password"} value={confirmPw} autoComplete="new-password" invalid={!!newPwErr}
            describedBy={newPwErr ? "rec-newpw-err" : undefined}
            onChange={(v: string) => { onConfirmPw(v); onNewPwErr(""); }} placeholder="Confirmar contraseña" icon={Lock} />
          {newPwErr && <p id="rec-newpw-err" role="alert" className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{newPwErr}</p>}
        </div>
      </div>
      <PrimaryBtn onClick={onSetNewPw} disabled={recLoading}>
        {recLoading ? <><Spinner /> Guardando...</> : "Guardar contraseña"}
      </PrimaryBtn>
    </div>
  );
}

/* ─── Recovery: Success screen ─── */
interface ForgotSuccessProps {
  onResetRecovery: () => void;
}

export function ForgotSuccessScreen({ onResetRecovery }: ForgotSuccessProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center">
      <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
        <CheckCircle2 className="w-8 h-8 text-success" />
      </div>
      <div>
        <h2 className="font-bold text-xl">¡Contraseña actualizada!</h2>
        <p className="text-sm text-muted-foreground mt-1">Ya puedes iniciar sesión con tu nueva contraseña.</p>
      </div>
      <PrimaryBtn onClick={onResetRecovery}>
        Ir al inicio de sesión <ChevronRight className="w-4 h-4" />
      </PrimaryBtn>
    </div>
  );
}
