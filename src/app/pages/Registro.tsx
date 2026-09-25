import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { AlertCircle, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';

import { useRegister } from '@features/auth/hooks/useRegister';
import { CONSENTIMIENTO_VERSION } from '@core/types';
import { FormField as Field } from './auth/components/FormField';

/** Carreras de los participantes del estudio. «Otra carrera» existe para no
 *  obligar a nadie a declarar algo que no es: si aparece, se revisa. */
const CARRERAS = ['Ingeniería Industrial', 'Ingeniería Empresarial', 'Otra carrera'];

function Spinner() {
  return (
    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
  );
}

/**
 * Registro de participantes.
 *
 * Hasta el 24 de septiembre de 2026 el alta se hacía fuera del sistema: un
 * formulario de Google recogía los datos y un script creaba las cuentas en
 * Moodle a mano. Esta pantalla lo trae adentro: quien se registra queda dado de
 * alta y matriculado en los cursos del estudio, y su consentimiento queda
 * guardado con la versión del texto que aceptó.
 *
 * El registro sólo crea estudiantes. La cuenta del docente se da de alta aparte,
 * porque su panel muestra la trazabilidad individual de todo el curso.
 */
export function Registro() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useRegister();

  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [carrera, setCarrera] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [acepta, setAcepta] = useState(false);
  const [error, setError] = useState('');
  const [listo, setListo] = useState(false);

  /** Las mismas reglas que aplica el servidor, para avisar antes de enviar. */
  const validar = (): string => {
    if (!nombres.trim()) return 'Ingresa tus nombres.';
    if (!apellidos.trim()) return 'Ingresa tus apellidos.';
    if (!carrera) return 'Selecciona tu carrera.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return 'Ingresa un correo válido.';
    if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
    if (!/\p{Lu}/u.test(password)) return 'Incluye al menos una mayúscula.';
    if (!/\d/.test(password)) return 'Incluye al menos un número.';
    if (!acepta) return 'Debes aceptar el consentimiento informado para participar.';
    return '';
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    const problema = validar();
    if (problema) {
      setError(problema);
      return;
    }
    setError('');
    try {
      await mutateAsync({
        correo: correo.trim().toLowerCase(),
        password,
        nombres: nombres.trim(),
        apellidos: apellidos.trim(),
        carrera,
        consentimiento_version: CONSENTIMIENTO_VERSION,
      });
      setListo(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : 'No pudimos completar tu registro. Inténtalo de nuevo en unos minutos.',
      );
    }
  };

  if (listo) {
    return (
      <main className="min-h-dvh flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md text-center space-y-4">
          <h1 className="text-2xl font-semibold">Tu cuenta está lista</h1>
          <p className="text-muted-foreground">
            Te matriculamos en los cursos del estudio. En unos minutos recibirás un correo
            del aula virtual con tu usuario y una contraseña que deberás cambiar al entrar.
          </p>
          <p className="text-muted-foreground">
            Empieza por los cuestionarios del aula virtual. Te avisaremos cuándo usar SWARD.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="mt-2 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground"
          >
            Ir a iniciar sesión
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh flex items-center justify-center px-4 py-10">
      <form onSubmit={enviar} className="w-full max-w-md space-y-5" noValidate>
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold">Inscripción al estudio</h1>
          <p className="text-sm text-muted-foreground">
            Creamos tu cuenta y te matriculamos en los cursos. Toma menos de dos minutos.
          </p>
        </header>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label htmlFor="nombres" className="text-sm font-medium">Nombres</label>
            <Field id="nombres" value={nombres} onChange={setNombres} icon={User} autoComplete="given-name" />
          </div>
          <div className="space-y-1">
            <label htmlFor="apellidos" className="text-sm font-medium">Apellidos</label>
            <Field id="apellidos" value={apellidos} onChange={setApellidos} autoComplete="family-name" />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="carrera" className="text-sm font-medium">Carrera</label>
          <select
            id="carrera"
            value={carrera}
            onChange={(e) => setCarrera(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="">Selecciona tu carrera</option>
            {CARRERAS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="correo" className="text-sm font-medium">Correo</label>
          <Field
            id="correo"
            type="email"
            value={correo}
            onChange={setCorreo}
            icon={Mail}
            placeholder="tucorreo@upc.edu.pe"
            autoComplete="email"
          />
          <p className="text-xs text-muted-foreground">
            Usa un correo que revises: por ahí llega el acceso al aula virtual.
          </p>
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium">Contraseña</label>
          <Field
            id="password"
            type={verPassword ? 'text' : 'password'}
            value={password}
            onChange={setPassword}
            icon={Lock}
            autoComplete="new-password"
            right={
              <button
                type="button"
                onClick={() => setVerPassword((v) => !v)}
                aria-label={verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {verPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
          <p className="text-xs text-muted-foreground">
            Mínimo 8 caracteres, con una mayúscula y un número. Es la de SWARD; la del aula
            virtual llega por correo.
          </p>
        </div>

        <section className="rounded-md border p-3 space-y-2">
          <h2 className="text-sm font-medium">Consentimiento informado</h2>
          <div className="max-h-44 overflow-y-auto pr-1 text-xs text-muted-foreground space-y-2">
            <p>
              Participas en la validación de <strong>SWARD</strong>, un sistema que recomienda
              material de estudio y explica por qué lo recomienda. Es parte de un proyecto de
              tesis de Ingeniería de Software de la UPC.
            </p>
            <p>
              <strong>No te estamos evaluando a ti.</strong> Evaluamos el sistema. Los
              cuestionarios del estudio no se califican y tu participación no afecta tu nota.
            </p>
            <p>
              <strong>Qué recogemos:</strong> tu nombre, carrera y correo, para crear tus
              cuentas; tus respuestas en el aula virtual y en los cuestionarios; y cómo usas el
              sistema. <strong>No se graba pantalla ni audio.</strong>
            </p>
            <p>
              <strong>Qué ve tu profesor:</strong> tu avance y tus notas del aula virtual, como
              en cualquier curso. No ve tus respuestas a los cuestionarios del estudio ni tus
              comentarios.
            </p>
            <p>
              <strong>Cómo te protegemos:</strong> se te asigna un código y los instrumentos se
              registran con él, nunca con tu nombre. En la memoria y en cualquier publicación
              los datos van agregados y anonimizados.
            </p>
            <p>
              <strong>Es voluntario.</strong> Puedes retirarte en cualquier momento, sin dar
              explicaciones y sin ninguna consecuencia. Conforme a la Ley 29733 puedes acceder a
              tus datos, rectificarlos y pedir que se eliminen. Los datos personales se eliminan
              al terminar el proyecto, en diciembre de 2026.
            </p>
          </div>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={acepta}
              onChange={(e) => setAcepta(e.target.checked)}
              className="mt-0.5"
            />
            <span>He leído y comprendido esta información, y acepto participar voluntariamente.</span>
          </label>
        </section>

        {error && (
          <p role="alert" className="flex items-start gap-2 text-sm text-destructive">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isPending && <Spinner />}
          {isPending ? 'Creando tu cuenta…' : 'Crear mi cuenta'}
        </button>

        <p className="text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta? <Link to="/login" className="underline">Inicia sesión</Link>
        </p>
      </form>
    </main>
  );
}

export default Registro;
