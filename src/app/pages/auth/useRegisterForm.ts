import { useState } from "react";
import { register } from "@features/auth/services/auth.service";

export interface RegisterFormData {
  correo: string;
  password: string;
  confirmPassword: string;
}

export interface UseRegisterFormReturn {
  formData: RegisterFormData;
  errors: Record<string, string>;
  isLoading: boolean;
  success: boolean;
  handleChange: (field: keyof RegisterFormData, value: string) => void;
  handleSubmit: (e: React.FormEvent, onNavigateToLogin: () => void) => Promise<void>;
}

function validateForm(data: RegisterFormData): Record<string, string> {
  const errs: Record<string, string> = {};
  if (!data.correo) {
    errs.correo = "El correo es requerido";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correo)) {
    errs.correo = "Ingresa un correo válido";
  }
  if (!data.password) {
    errs.password = "La contraseña es requerida";
  } else if (data.password.length < 8) {
    errs.password = "Mínimo 8 caracteres";
  } else if (!/[A-Z]/.test(data.password)) {
    errs.password = "Debe incluir al menos una mayúscula";
  } else if (!/[0-9]/.test(data.password)) {
    errs.password = "Debe incluir al menos un número";
  }
  if (data.password !== data.confirmPassword) {
    errs.confirmPassword = "Las contraseñas no coinciden";
  }
  return errs;
}

export function useRegisterForm(): UseRegisterFormReturn {
  const [formData, setFormData] = useState<RegisterFormData>({
    correo: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent, onNavigateToLogin: () => void) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);
    try {
      await register({ correo: formData.correo, password: formData.password });
      setSuccess(true);
      setTimeout(onNavigateToLogin, 2000);
    } catch (err: unknown) {
      const detail =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      if (detail?.includes("no registrado") || detail?.includes("plataforma educativa")) {
        setErrors({ correo: detail });
      } else if (detail?.includes("ya se encuentra registrado")) {
        setErrors({ correo: detail });
      } else if (detail?.includes("Contraseña")) {
        setErrors({ password: detail });
      } else {
        setErrors({ form: detail ?? "Error al crear la cuenta. Inténtalo de nuevo." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, errors, isLoading, success, handleChange, handleSubmit };
}
