import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Video,
  BookOpen,
  FileText,
  Search,
  Clock,
  Star,
  CheckCircle2,
  PlayCircle,
  Filter,
  Sparkles,
  Info,
  BarChart2,
} from "lucide-react";
import { ResourceViewer } from "./ResourceViewer";

interface Resource {
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

const allResources: Resource[] = [
  {
    id: 1,
    title: "Normalización de Bases de Datos - Formas Normales",
    type: "video",
    concept: "Bases de Datos",
    difficulty: "Intermedio",
    duration: "18 min",
    rating: 4.8,
    reason: "Tu dominio en este concepto es del 55%. Este recurso refuerza los fundamentos de normalización, donde has mostrado dificultades en los últimos 3 ejercicios.",
    content: "Contenido del video sobre normalización de bases de datos...",
    confidence: 92,
    improvement: 8,
    isRecommended: true,
    tags: ["SQL", "Relacional", "Diseño"],
  },
  {
    id: 2,
    title: "Ejercicios Prácticos de Deep Learning",
    type: "exercise",
    concept: "Deep Learning",
    difficulty: "Intermedio",
    duration: "30 min",
    rating: 4.6,
    reason: "Reforzar concepto con dominio medio (65%). La práctica te ayudará a consolidar el conocimiento.",
    content: "¿Cuál es la función de activación más común en redes neuronales profundas?\n\nSelecciona la respuesta correcta:",
    confidence: 87,
    improvement: 6,
    isRecommended: true,
    tags: ["PyTorch", "Práctica", "Backpropagation"],
  },
  {
    id: 3,
    title: "Lectura: Arquitecturas de Atención",
    type: "reading",
    concept: "Knowledge Tracing",
    difficulty: "Avanzado",
    duration: "20 min",
    rating: 4.9,
    reason: "Tienes un buen dominio (90%) en Knowledge Tracing. Este tema es el siguiente paso natural.",
    content: `Las arquitecturas de atención son mecanismos que permiten a los modelos enfocarse en partes específicas de la entrada al procesar información.\n\nEn el contexto de Knowledge Tracing, el modelo SAKT utiliza mecanismos de auto-atención para:\n\n1. Identificar qué interacciones pasadas son más relevantes\n2. Ponderar la importancia de cada concepto\n3. Generar representaciones contextuales del estado de conocimiento`,
    confidence: 91,
    improvement: 5,
    isRecommended: true,
    tags: ["Transformers", "SAKT", "Atención"],
  },
  {
    id: 4,
    title: "Fundamentos de Redes Neuronales",
    type: "video",
    concept: "Redes Neuronales",
    difficulty: "Básico",
    duration: "25 min",
    rating: 4.7,
    reason: "Tu dominio en Redes Neuronales es bajo (45%). Este video cubre los fundamentos esenciales.",
    content: "Video sobre fundamentos de redes neuronales...",
    confidence: 94,
    improvement: 15,
    isRecommended: true,
    tags: ["Perceptrón", "Activación", "Capas"],
  },
  {
    id: 5,
    title: "Python para Machine Learning",
    type: "reading",
    concept: "Python Básico",
    difficulty: "Básico",
    duration: "15 min",
    rating: 4.5,
    reason: "Complementa tu dominio actual en Python (75%) con técnicas específicas de ML.",
    content: "Lectura sobre Python para Machine Learning...",
    confidence: 78,
    improvement: 4,
    isRecommended: false,
    tags: ["NumPy", "Pandas", "Scikit-learn"],
  },
  {
    id: 6,
    title: "Introducción a Knowledge Tracing",
    type: "video",
    concept: "Knowledge Tracing",
    difficulty: "Básico",
    duration: "12 min",
    rating: 4.3,
    reason: "Base teórica del modelo SAKT que usa esta plataforma. Útil para entender tus métricas.",
    content: "Video introductorio sobre Knowledge Tracing...",
    confidence: 82,
    improvement: 3,
    isRecommended: false,
    tags: ["BKT", "IRT", "SAKT"],
  },
  {
    id: 7,
    title: "Quiz: Conceptos de Inteligencia Artificial",
    type: "exercise",
    concept: "Introducción a IA",
    difficulty: "Básico",
    duration: "20 min",
    rating: 4.4,
    reason: "Evalúa y refuerza tu comprensión general de IA.",
    content: "¿Cuál es la diferencia entre Machine Learning y Deep Learning?\n\nSelecciona la respuesta correcta:",
    confidence: 85,
    improvement: 7,
    isRecommended: false,
    tags: ["IA General", "Evaluación"],
  },
  {
    id: 8,
    title: "Convolutional Neural Networks - CNN",
    type: "video",
    concept: "Deep Learning",
    difficulty: "Avanzado",
    duration: "35 min",
    rating: 4.9,
    reason: "Siguiente paso tras dominar redes densas. Alta correlación con tu trayectoria de aprendizaje.",
    content: "Video sobre CNN...",
    confidence: 76,
    improvement: 10,
    isRecommended: false,
    tags: ["Visión", "Convolución", "Pooling"],
  },
];

interface ResourcesTabProps {
  completedResources: number[];
  onCompleteResource: (id: number) => void;
}

const typeIcons: Record<string, React.ReactNode> = {
  video: <Video className="w-4 h-4" />,
  exercise: <BookOpen className="w-4 h-4" />,
  reading: <FileText className="w-4 h-4" />,
};

const typeLabels: Record<string, string> = {
  video: "Video",
  exercise: "Ejercicio",
  reading: "Lectura",
};

const difficultyColor: Record<string, string> = {
  Básico: "bg-success/10 text-success",
  Intermedio: "bg-warning/10 text-warning",
  Avanzado: "bg-primary/10 text-primary",
};

export function ResourcesTab({ completedResources, onCompleteResource }: ResourcesTabProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [conceptFilter, setConceptFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeResource, setActiveResource] = useState<number | null>(null);
  const [showOnlyRecommended, setShowOnlyRecommended] = useState(false);

  const concepts = Array.from(new Set(allResources.map((r) => r.concept)));

  const filtered = allResources.filter((r) => {
    const matchSearch =
      search === "" ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.concept.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchType = typeFilter === "all" || r.type === typeFilter;
    const matchConcept = conceptFilter === "all" || r.concept === conceptFilter;
    const matchDiff = difficultyFilter === "all" || r.difficulty === difficultyFilter;
    const isCompleted = completedResources.includes(r.id);
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "completed" && isCompleted) ||
      (statusFilter === "pending" && !isCompleted);
    const matchRec = !showOnlyRecommended || r.isRecommended;
    return matchSearch && matchType && matchConcept && matchDiff && matchStatus && matchRec;
  });

  const recommended = filtered.filter((r) => r.isRecommended);
  const others = filtered.filter((r) => !r.isRecommended);

  const currentResource = allResources.find((r) => r.id === activeResource);

  const handleComplete = () => {
    if (activeResource) {
      onCompleteResource(activeResource);
      setActiveResource(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Completados</p>
                <p className="font-bold">{completedResources.length + 12} / {allResources.length + 10}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Recomendados</p>
                <p className="font-bold">{allResources.filter((r) => r.isRecommended).length} activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-warning/10 flex items-center justify-center">
                <BarChart2 className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Mejora estimada</p>
                <p className="font-bold">+12% dominio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="pt-4 pb-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar recursos por título, concepto o etiqueta..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />

            <div className="shrink-0" style={{ width: 148 }}>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-8 text-xs px-3" style={{ overflow: "hidden" }}>
                  <span className="truncate whitespace-nowrap">
                    {typeFilter === "all" ? "Todos los tipos" : typeFilter === "video" ? "Video" : typeFilter === "exercise" ? "Ejercicio" : "Lectura"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="exercise">Ejercicio</SelectItem>
                  <SelectItem value="reading">Lectura</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="shrink-0" style={{ width: 168 }}>
              <Select value={conceptFilter} onValueChange={setConceptFilter}>
                <SelectTrigger className="h-8 text-xs px-3" style={{ overflow: "hidden" }}>
                  <span className="truncate whitespace-nowrap">
                    {conceptFilter === "all" ? "Todos los conceptos" : conceptFilter}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los conceptos</SelectItem>
                  {concepts.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="shrink-0" style={{ width: 120 }}>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="h-8 text-xs px-3" style={{ overflow: "hidden" }}>
                  <span className="truncate whitespace-nowrap">
                    {difficultyFilter === "all" ? "Dificultad" : difficultyFilter}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="Básico">Básico</SelectItem>
                  <SelectItem value="Intermedio">Intermedio</SelectItem>
                  <SelectItem value="Avanzado">Avanzado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="shrink-0" style={{ width: 120 }}>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 text-xs px-3" style={{ overflow: "hidden" }}>
                  <span className="truncate whitespace-nowrap">
                    {statusFilter === "all" ? "Estado" : statusFilter === "pending" ? "Pendientes" : "Completados"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="completed">Completados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <button
              onClick={() => setShowOnlyRecommended(!showOnlyRecommended)}
              className={`flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs border transition-colors whitespace-nowrap shrink-0 ${
                showOnlyRecommended
                  ? "bg-primary text-white border-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Solo recomendados
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            {filtered.length} recurso{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>

      {/* Recommended Section */}
      {recommended.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">Recomendados por SAKT para ti</h3>
            <Badge variant="outline" className="text-xs">{recommended.length}</Badge>
          </div>
          <div className="space-y-3">
            {recommended.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                isCompleted={completedResources.includes(resource.id)}
                onStart={() => setActiveResource(resource.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other Resources */}
      {others.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm text-muted-foreground">Catálogo completo</h3>
            <Badge variant="outline" className="text-xs">{others.length}</Badge>
          </div>
          <div className="space-y-3">
            {others.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                isCompleted={completedResources.includes(resource.id)}
                onStart={() => setActiveResource(resource.id)}
              />
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="py-16 text-center text-muted-foreground">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No se encontraron recursos</p>
          <p className="text-sm mt-1">Intenta con otros filtros o términos de búsqueda</p>
        </div>
      )}

      {/* Resource Viewer */}
      {activeResource && currentResource && (
        <ResourceViewer
          resource={currentResource}
          onComplete={handleComplete}
          onClose={() => setActiveResource(null)}
        />
      )}
    </div>
  );
}

function ResourceCard({
  resource,
  isCompleted,
  onStart,
}: {
  resource: Resource;
  isCompleted: boolean;
  onStart: () => void;
}) {
  return (
    <Card
      className={`transition-all ${
        isCompleted ? "opacity-70 border-success/40 bg-success/5" : "hover:border-primary/40"
      } ${resource.isRecommended ? "border-primary/30 bg-primary/5" : ""}`}
    >
      <CardContent className="pt-4 pb-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div
              className={`w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 ${
                resource.type === "video"
                  ? "bg-blue-500/10 text-blue-500"
                  : resource.type === "exercise"
                  ? "bg-orange-500/10 text-orange-500"
                  : "bg-purple-500/10 text-purple-500"
              }`}
            >
              {typeIcons[resource.type]}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm leading-tight">{resource.title}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                  {resource.concept}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColor[resource.difficulty]}`}>
                  {resource.difficulty}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                  <Clock className="w-3 h-3" /> {resource.duration}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-warning text-warning" /> {resource.rating}
                </span>
              </div>
            </div>
          </div>
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
          ) : (
            <Badge variant={resource.type as any} className="shrink-0">
              {typeLabels[resource.type]}
            </Badge>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {resource.tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>

        {/* XAI Reason (only if recommended) */}
        {resource.isRecommended && (
          <div className="p-3 bg-muted/40 border border-primary/10 rounded-[10px] space-y-2">
            <p className="text-xs font-medium flex items-center gap-1.5 text-foreground">
              <Info className="w-3.5 h-3.5 text-primary" />
              ¿Por qué te recomendamos esto?
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">{resource.reason}</p>
            <div className="flex gap-2">
              <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                Confianza: {resource.confidence}%
              </span>
              <span className="text-xs px-2 py-0.5 bg-success/10 text-success rounded-full">
                Mejora: +{resource.improvement}%
              </span>
            </div>
          </div>
        )}

        {/* Progress bar (if recommended, show expected improvement) */}
        {resource.isRecommended && !isCompleted && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Dominio actual en {resource.concept}</span>
              <span>Meta: +{resource.improvement}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${Math.min(resource.confidence, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Action */}
        {isCompleted ? (
          <div className="flex items-center gap-2 text-xs text-success font-medium">
            <CheckCircle2 className="w-4 h-4" />
            Recurso completado
          </div>
        ) : (
          <Button
            size="sm"
            className={`w-full gap-2 ${resource.isRecommended ? "" : "variant-outline"}`}
            variant={resource.isRecommended ? "default" : "outline"}
            onClick={onStart}
          >
            <PlayCircle className="w-4 h-4" />
            Comenzar Recurso
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
