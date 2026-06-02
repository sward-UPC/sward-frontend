import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface RegisterPageProps {
  onNavigateToLogin: () => void;
}

export function RegisterPage({ onNavigateToLogin }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student" as "student" | "teacher",
    institution: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "El nombre completo es requerido";
    }

    if (!formData.email) {
      newErrors.email = "El correo electrónico es requerido";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Por favor ingrese un correo válido";
      }
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (!formData.institution.trim()) {
      newErrors.institution = "La institución es requerida";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    // Simular registro
    setTimeout(() => {
      // Simular email ya registrado
      if (formData.email === "existing@sward.edu.pe") {
        setErrors({ email: "El correo ya se encuentra registrado. Intente iniciar sesión." });
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setSuccess(true);

      setTimeout(() => {
        onNavigateToLogin();
      }, 2000);
    }, 1500);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (success) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-success" />
                </div>
              </div>
              <h3 className="font-medium">¡Registro Exitoso!</h3>
              <p className="text-sm text-muted-foreground">
                Tu cuenta ha sido creada. Se ha enviado un correo de confirmación a {formData.email}
              </p>
              <p className="text-sm text-muted-foreground">
                Redirigiendo al inicio de sesión...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">S</span>
            </div>
          </div>
          <CardTitle className="text-center">Crear Cuenta en SWARD</CardTitle>
          <CardDescription className="text-center">
            Complete el formulario para registrarse
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" required>
                Nombre Completo
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Juan Pérez López"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                error={!!errors.fullName}
                helperText={errors.fullName}
                disabled={isLoading}
                aria-required="true"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" required>
                Correo Institucional
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu-correo@universidad.edu.pe"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                disabled={isLoading}
                aria-required="true"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="institution" required>
                Institución
              </Label>
              <Input
                id="institution"
                type="text"
                placeholder="Universidad Peruana de Ciencias Aplicadas"
                value={formData.institution}
                onChange={(e) => handleChange("institution", e.target.value)}
                error={!!errors.institution}
                helperText={errors.institution}
                disabled={isLoading}
                aria-required="true"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Tipo de Usuario</Label>
              <Select
                value={formData.role}
                onValueChange={(value: any) => handleChange("role", value)}
                disabled={isLoading}
              >
                <SelectTrigger id="role" aria-label="Seleccionar tipo de usuario">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Estudiante</SelectItem>
                  <SelectItem value="teacher">Docente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" required>
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
                disabled={isLoading}
                aria-required="true"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" required>
                Confirmar Contraseña
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repita su contraseña"
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                disabled={isLoading}
                aria-required="true"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creando cuenta..." : "Registrarse"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <button
                type="button"
                className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded"
                onClick={onNavigateToLogin}
              >
                Inicia sesión aquí
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
