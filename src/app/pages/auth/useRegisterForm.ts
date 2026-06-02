import { useState } from "react";

export interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "student" | "teacher";
  institution: string;
}

export interface UseRegisterFormReturn {
  formData: RegisterFormData;
  errors: Record<string, string>;
  isLoading: boolean;
  success: boolean;
  handleChange: (field: string, value: string) => void;
  handleSubmit: (e: React.FormEvent, onNavigateToLogin: () => void) => void;
}

export function useRegisterForm(): UseRegisterFormReturn {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    institution: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "El nombre completo es requerido";
    if (!formData.email) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Por favor ingrese un correo válido";
    }
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }
    if (!formData.institution.trim()) newErrors.institution = "La institución es requerida";
    return newErrors;
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
    }
  };

  const handleSubmit = async (e: React.FormEvent, onNavigateToLogin: () => void) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setErrors({});
    setIsLoading(true);
    setTimeout(() => {
      if (formData.email === "existing@sward.edu.pe") {
        setErrors({ email: "El correo ya se encuentra registrado. Intente iniciar sesión." });
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => { onNavigateToLogin(); }, 2000);
    }, 1500);
  };

  return { formData, errors, isLoading, success, handleChange, handleSubmit };
}
