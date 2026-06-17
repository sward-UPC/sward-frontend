import { CheckCircle2, Lock, Mail } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { useRegisterForm } from "./auth";

interface RegisterPageProps {
  onNavigateToLogin: () => void;
}

export function RegisterPage({ onNavigateToLogin }: RegisterPageProps) {
  const { formData, errors, isLoading, success, handleChange, handleSubmit } = useRegisterForm();

  if (success) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h3 className="font-semibold text-lg">¡Cuenta creada exitosamente!</h3>
              <p className="text-sm text-muted-foreground">
                Tu cuenta ha sido creada con el rol asignado en Moodle.
                Redirigiendo al inicio de sesión…
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
          <CardTitle className="text-center">Crear cuenta en SWARD</CardTitle>
          <CardDescription className="text-center">
            Usa el correo institucional con el que accedes a Moodle.
            Tu rol (estudiante o docente) se asignará automáticamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => handleSubmit(e, onNavigateToLogin)} className="space-y-4">

            {errors.form && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                {errors.form}
              </div>
            )}

            {/* Correo institucional */}
            <div className="space-y-1.5">
              <label htmlFor="correo" className="text-sm font-medium leading-none">
                Correo institucional
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="correo"
                  type="email"
                  autoComplete="email"
                  placeholder="tu-correo@universidad.edu"
                  value={formData.correo}
                  onChange={(e) => handleChange("correo", e.target.value)}
                  disabled={isLoading}
                  aria-required="true"
                  aria-describedby={errors.correo ? "correo-error" : undefined}
                  className={`w-full pl-9 pr-3 py-2 rounded-md border bg-background text-sm ring-offset-background
                    placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50
                    ${errors.correo ? "border-destructive" : "border-input"}`}
                />
              </div>
              {errors.correo && (
                <p id="correo-error" className="text-xs text-destructive">
                  {errors.correo}
                </p>
              )}
            </div>

            {/* Contraseña */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium leading-none">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Mín. 8 caracteres, 1 mayúscula, 1 número"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  disabled={isLoading}
                  aria-required="true"
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className={`w-full pl-9 pr-3 py-2 rounded-md border bg-background text-sm ring-offset-background
                    placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50
                    ${errors.password ? "border-destructive" : "border-input"}`}
                />
              </div>
              {errors.password && (
                <p id="password-error" className="text-xs text-destructive">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="text-sm font-medium leading-none">
                Confirmar contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repite tu contraseña"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  disabled={isLoading}
                  aria-required="true"
                  aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
                  className={`w-full pl-9 pr-3 py-2 rounded-md border bg-background text-sm ring-offset-background
                    placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50
                    ${errors.confirmPassword ? "border-destructive" : "border-input"}`}
                />
              </div>
              {errors.confirmPassword && (
                <p id="confirm-error" className="text-xs text-destructive">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creando cuenta…" : "Registrarse"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <button
                type="button"
                className="text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                onClick={onNavigateToLogin}
              >
                Inicia sesión aquí
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
