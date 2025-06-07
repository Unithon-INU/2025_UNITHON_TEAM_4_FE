"use client";

import { MapPin, Calendar } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/Badge";
import { regions, seasons } from "../constants";

interface AppliedFiltersProps {
  selectedRegion: string;
  selectedSeason: string;
  selectedKeywords: string[];
  onReset: () => void;
  // (옵션: onRemoveKeyword, onRemoveRegion 등 추가로 지원 가능)
}

export function AppliedFilters({
  selectedRegion,
  selectedSeason,
  selectedKeywords,
  onReset,
}: AppliedFiltersProps) {
  const hasAny =
    selectedRegion !== "all" || selectedSeason !== "all" || selectedKeywords.length > 0;

  if (!hasAny) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <span className="text-sm text-gray-500">적용된 필터:</span>
      {selectedRegion !== "all" && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {regions.find((r) => r.value === selectedRegion)?.label}
        </Badge>
      )}
      {selectedSeason !== "all" && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {seasons.find((s) => s.value === selectedSeason)?.label}
        </Badge>
      )}
      {selectedKeywords.map((keyword) => (
        <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
          {keyword}
        </Badge>
      ))}
      <Button variant="ghost" size="sm" className="h-6 text-xs text-gray-500" onClick={onReset}>
        필터 초기화
      </Button>
    </div>
  );
}
