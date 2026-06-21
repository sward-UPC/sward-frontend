import { apiClient } from '@core/api/client';
import { ENDPOINTS } from '@core/api/endpoints';

/** Pregunta de opción múltiple de un quiz generado. */
export interface PreguntaQuiz {
  enunciado: string;
  opciones: string[];
  /** Índice (0-based) de la opción correcta. */
  correcta: number;
  explicacion: string;
}

/** Ejercicio de práctica con su solución. */
export interface EjercicioPractica {
  enunciado: string;
  solucion: string;
}

/** Recurso tipo quiz interactivo. */
export interface RecursoQuiz {
  tipo: 'quiz';
  titulo: string;
  preguntas: PreguntaQuiz[];
}

/** Flashcard (tarjeta de memorización) frente/reverso. */
export interface Flashcard {
  frente: string;
  reverso: string;
}

/** Recurso tipo lectura (mini-lección + flashcards para memorizar). */
export interface RecursoLectura {
  tipo: 'lectura';
  titulo: string;
  contenido: string;
  flashcards?: Flashcard[];
}

/** Recurso tipo práctica (ejercicios con solución). */
export interface RecursoPractica {
  tipo: 'practica';
  titulo: string;
  ejercicios: EjercicioPractica[];
}

/** Recurso tipo video real de YouTube. */
export interface RecursoVideo {
  tipo: 'video';
  titulo: string;
  video_id: string;
  url: string;
  query: string;
}

/** Unión de recursos educativos tipados generados por el LLM. */
export type RecursoGenerado = RecursoQuiz | RecursoLectura | RecursoPractica | RecursoVideo;

/** Material de refuerzo generado por LLM para el concepto débil del alumno. */
export interface MaterialGenerado {
  disponible: boolean;
  concepto: string | null;
  recursos: RecursoGenerado[];
  /** Dominio (0-100) estimado por el SAKT en el concepto débil, para el XAI. */
  dominio?: number | null;
}

/**
 * Genera un set de recursos educativos tipados (quiz interactivo, mini-lección,
 * práctica y un video real de YouTube) con un LLM, para reforzar el concepto débil.
 */
export async function generarMaterial(
  estudianteId: string,
  cursoId: string,
): Promise<MaterialGenerado> {
  const { data } = await apiClient.post<MaterialGenerado>(ENDPOINTS.teacher.generateMaterial, {
    estudianteId,
    cursoId,
  });
  return data;
}

/** Resultado de registrar un quiz respondido. */
export interface QuizResultRegistrado {
  registrado: boolean;
  nota: number;
  is_correct: boolean;
}

/**
 * Registra el resultado de un quiz generado como una interacción de trazabilidad.
 * Cierra el loop de feedback: la nota retroalimenta al modelo SAKT en el próximo
 * reentrenamiento. El `estudiante_id` lo toma el backend del JWT.
 */
export async function registrarResultadoQuiz(params: {
  cursoId: string;
  concepto: string;
  totalPreguntas: number;
  correctas: number;
}): Promise<QuizResultRegistrado> {
  const { data } = await apiClient.post<QuizResultRegistrado>(ENDPOINTS.interactions.quizResult, {
    curso_id: params.cursoId,
    concepto: params.concepto,
    total_preguntas: params.totalPreguntas,
    correctas: params.correctas,
    tipo_recurso: 'quiz_generado',
  });
  return data;
}
