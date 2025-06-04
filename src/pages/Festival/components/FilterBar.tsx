// src/pages/Festival/components/FilterBar.tsx
"use client";

import { Filter } from "lucide-react";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../components/Popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/Select";
import { SearchBar } from "../components/SearchBar";
import { keywords, regions, seasons } from "../constants";

interface FilterBarProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  selectedSeason: string;
  onSeasonChange: (season: string) => void;
  selectedKeywords: string[];
  onToggleKeyword: (keyword: string) => void;
  onReset: () => void;
}

export function FilterBar({
  searchQuery,
  onSearch,
  selectedRegion,
  onRegionChange,
  selectedSeason,
  onSeasonChange,
  selectedKeywords,
  onToggleKeyword,
  onReset,
}: FilterBarProps) {
  const hasFilter =
    selectedRegion !== "all" || selectedSeason !== "all" || selectedKeywords.length > 0;

  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <SearchBar onSearch={onSearch} defaultValue={searchQuery} />

      <Popover>
        <PopoverTrigger >
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            필터
            {hasFilter && (
              <Badge className="ml-1 rounded-full bg-rose-500 px-1.5 py-0.5 text-xs text-white">
                필터 적용됨
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4 p-2">
            <div className="space-y-2">
              <h4 className="font-medium">지역</h4>
              <Select value={selectedRegion} onValueChange={onRegionChange}>
                <SelectTrigger>
                  <SelectValue placeholder="지역 선택" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.value} value={region.value}>
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">계절</h4>
              <Select value={selectedSeason} onValueChange={onSeasonChange}>
                <SelectTrigger>
                  <SelectValue placeholder="계절 선택" />
                </SelectTrigger>
                <SelectContent>
                  {seasons.map((season) => (
                    <SelectItem key={season.value} value={season.value}>
                      {season.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">키워드</h4>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword) => (
                  <Badge
                    key={keyword}
                    variant={selectedKeywords.includes(keyword) ? "default" : "outline"}
                    className={`cursor-pointer ${
                      selectedKeywords.includes(keyword)
                        ? "bg-rose-500 hover:bg-rose-600"
                        : "hover:bg-rose-100"
                    }`}
                    onClick={() => onToggleKeyword(keyword)}
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" size="sm" onClick={onReset}>
                초기화
              </Button>
              <Button size="sm" className="bg-rose-500 hover:bg-rose-600">
                적용하기
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
