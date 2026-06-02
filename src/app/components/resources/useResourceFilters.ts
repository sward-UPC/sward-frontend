import { useState } from "react";
import { Resource } from "./types";
import { allResources } from "./data";

export interface ResourceFilters {
  search: string;
  typeFilter: string;
  conceptFilter: string;
  difficultyFilter: string;
  statusFilter: string;
  showOnlyRecommended: boolean;
}

export interface UseResourceFiltersResult {
  filters: ResourceFilters;
  setSearch: (v: string) => void;
  setTypeFilter: (v: string) => void;
  setConceptFilter: (v: string) => void;
  setDifficultyFilter: (v: string) => void;
  setStatusFilter: (v: string) => void;
  toggleRecommended: () => void;
  filtered: Resource[];
  recommended: Resource[];
  others: Resource[];
  concepts: string[];
}

export function useResourceFilters(completedResources: number[]): UseResourceFiltersResult {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [conceptFilter, setConceptFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
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

  return {
    filters: { search, typeFilter, conceptFilter, difficultyFilter, statusFilter, showOnlyRecommended },
    setSearch,
    setTypeFilter,
    setConceptFilter,
    setDifficultyFilter,
    setStatusFilter,
    toggleRecommended: () => setShowOnlyRecommended((prev) => !prev),
    filtered,
    recommended: filtered.filter((r) => r.isRecommended),
    others: filtered.filter((r) => !r.isRecommended),
    concepts,
  };
}
