import { Outlet } from 'react-router';

/** Layout no autenticado: fondo centrado con logo SWARD y card de contenido. */
export function AuthLayout() {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-4">
      {/* Branding */}
      <div className="flex flex-col items-center gap-2 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
          <span className="text-xl font-bold text-white">S</span>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">SWARD</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Sistema Web Distribuido de Recomendación Adaptativa y Explicable
          </p>
        </div>
      </div>

      {/* Card de autenticación */}
      <div className="w-full max-w-sm">
        <Outlet />
      </div>

      {/* Footer */}
      <p className="mt-8 text-xs text-muted-foreground text-center">
        TP202610051 &mdash; Universidad Peruana de Ciencias Aplicadas
      </p>
    </div>
  );
}
