import { useState, useEffect } from "react";

export type LoginScreen = "login" | "forgot-email" | "forgot-code" | "forgot-newpass" | "forgot-success";

export interface UseLoginFormReturn {
  // Login
  loginEmail: string;
  loginPassword: string;
  showLoginPw: boolean;
  loginRole: "student" | "teacher" | "admin";
  loginError: string;
  loginLoading: boolean;
  loginScreen: LoginScreen;
  // Recovery
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
  // Setters
  setLoginEmail: (v: string) => void;
  setLoginPassword: (v: string) => void;
  setShowLoginPw: (v: boolean | ((p: boolean) => boolean)) => void;
  setLoginRole: (v: "student" | "teacher" | "admin") => void;
  setLoginError: (v: string) => void;
  setLoginScreen: (v: LoginScreen) => void;
  setRecEmail: (v: string) => void;
  setRecEmailErr: (v: string) => void;
  setOtp: (v: string[]) => void;
  setOtpErr: (v: string) => void;
  setNewPw: (v: string) => void;
  setConfirmPw: (v: string) => void;
  setShowNewPw: (v: boolean | ((p: boolean) => boolean)) => void;
  setNewPwErr: (v: string) => void;
  setResendTimer: (v: number | ((p: number) => number)) => void;
  // Handlers
  handleLogin: (e: React.FormEvent, onLogin: (correo: string, password: string) => Promise<void>) => void;
  handleSendCode: () => void;
  handleVerifyCode: () => void;
  handleSetNewPw: () => void;
  resetRecovery: () => void;
}

export function useLoginForm(): UseLoginFormReturn {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginRole, setLoginRole] = useState<"student" | "teacher" | "admin">("student");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginScreen, setLoginScreen] = useState<LoginScreen>("login");

  const [recEmail, setRecEmail] = useState("");
  const [recEmailErr, setRecEmailErr] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpErr, setOtpErr] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);
  const [newPwErr, setNewPwErr] = useState("");
  const [recLoading, setRecLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleLogin = (e: React.FormEvent, onLogin: (correo: string, password: string) => Promise<void>) => {
    e.preventDefault();
    setLoginError("");
    if (!loginEmail) { setLoginError("Ingresa tu correo."); return; }
    if (!loginPassword) { setLoginError("Ingresa tu contraseña."); return; }
    setLoginLoading(true);
    onLogin(loginEmail, loginPassword)
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Credenciales incorrectas. Por favor verifica tu correo y contraseña.";
        setLoginError(msg);
      })
      .finally(() => setLoginLoading(false));
  };

  const handleSendCode = () => {
    if (!recEmail) { setRecEmailErr("Ingresa tu correo."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recEmail)) { setRecEmailErr("Correo inválido."); return; }
    setRecEmailErr("");
    setRecLoading(true);
    setTimeout(() => {
      setRecLoading(false);
      setOtp(["", "", "", "", "", ""]);
      setResendTimer(60);
      setLoginScreen("forgot-code");
    }, 1200);
  };

  const handleVerifyCode = () => {
    if (otp.join("").length < 6) { setOtpErr("Ingresa los 6 dígitos."); return; }
    setOtpErr("");
    setRecLoading(true);
    setTimeout(() => {
      setRecLoading(false);
      setNewPw("");
      setConfirmPw("");
      setLoginScreen("forgot-newpass");
    }, 900);
  };

  const handleSetNewPw = () => {
    if (!newPw) { setNewPwErr("Ingresa una contraseña."); return; }
    if (newPw.length < 8) { setNewPwErr("Mínimo 8 caracteres."); return; }
    if (newPw !== confirmPw) { setNewPwErr("Las contraseñas no coinciden."); return; }
    setNewPwErr("");
    setRecLoading(true);
    setTimeout(() => { setRecLoading(false); setLoginScreen("forgot-success"); }, 1000);
  };

  const resetRecovery = () => {
    setLoginScreen("login");
    setRecEmail("");
    setRecEmailErr("");
    setOtp(["", "", "", "", "", ""]);
    setOtpErr("");
    setNewPw("");
    setConfirmPw("");
    setNewPwErr("");
  };

  return {
    loginEmail, loginPassword, showLoginPw, loginRole, loginError, loginLoading, loginScreen,
    recEmail, recEmailErr, otp, otpErr, newPw, confirmPw, showNewPw, newPwErr, recLoading, resendTimer,
    setLoginEmail, setLoginPassword, setShowLoginPw, setLoginRole, setLoginError, setLoginScreen,
    setRecEmail, setRecEmailErr, setOtp, setOtpErr, setNewPw, setConfirmPw, setShowNewPw, setNewPwErr, setResendTimer,
    handleLogin, handleSendCode, handleVerifyCode, handleSetNewPw, resetRecovery,
  };
}
