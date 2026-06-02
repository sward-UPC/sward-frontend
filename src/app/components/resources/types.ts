export interface Resource {
  id: number;
  title: string;
  type: "video" | "exercise" | "reading";
  concept: string;
  difficulty: "Básico" | "Intermedio" | "Avanzado";
  duration: string;
  rating: number;
  reason: string;
  content: string;
  confidence: number;
  improvement: number;
  isRecommended: boolean;
  tags: string[];
}
