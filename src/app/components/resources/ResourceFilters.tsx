import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../ui/select";
import { Search, Filter, Sparkles } from "lucide-react";
import { ResourceFilters as Filters } from "./useResourceFilters";

interface ResourceFiltersProps {
  filters: Filters;
  concepts: string[];
  filteredCount: number;
  onSearchChange: (v: string) => void;
  onTypeChange: (v: string) => void;
  onConceptChange: (v: string) => void;
  onDifficultyChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onToggleRecommended: () => void;
}

export function ResourceFilters({
  filters,
  concepts,
  filteredCount,
  onSearchChange,
  onTypeChange,
  onConceptChange,
  onDifficultyChange,
  onStatusChange,
  onToggleRecommended,
}: ResourceFiltersProps) {
  const { search, typeFilter, conceptFilter, difficultyFilter, statusFilter, showOnlyRecommended } = filters;

  return (
    <Card>
      <CardContent className="pt-4 pb-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar recursos por título, concepto o etiqueta..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />

          <div className="shrink-0" style={{ width: 148 }}>
            <Select value={typeFilter} onValueChange={onTypeChange}>
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
            <Select value={conceptFilter} onValueChange={onConceptChange}>
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
            <Select value={difficultyFilter} onValueChange={onDifficultyChange}>
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
            <Select value={statusFilter} onValueChange={onStatusChange}>
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
            onClick={onToggleRecommended}
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
          {filteredCount} recurso{filteredCount !== 1 ? "s" : ""} encontrado{filteredCount !== 1 ? "s" : ""}
        </p>
      </CardContent>
    </Card>
  );
}
