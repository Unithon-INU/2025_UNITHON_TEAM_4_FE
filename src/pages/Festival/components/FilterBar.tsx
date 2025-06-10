"use client";

import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../components/Popover";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../components/Select";
import { SearchBar } from "../components/SearchBar";
import { keywords } from "../constants";

// AND/OR 토글 버튼
function KeywordModeToggle({
  mode,
  onChange,
}: {
  mode: "AND" | "OR";
  onChange: (m: "AND" | "OR") => void;
}) {
  return (
    <div className="flex gap-2 items-center">
      <span className="text-xs text-gray-400">키워드 모드</span>
      <Button
        size="sm"
        variant={mode === "OR" ? "default" : "outline"}
        className="px-2 py-0.5 text-xs"
        onClick={() => onChange("OR")}
      >
        OR
      </Button>
      <Button
        size="sm"
        variant={mode === "AND" ? "default" : "outline"}
        className="px-2 py-0.5 text-xs"
        onClick={() => onChange("AND")}
      >
        AND
      </Button>
    </div>
  );
}

interface FilterBarProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  selectedSeason: string;
  onSeasonChange: (season: string) => void;
  selectedKeywords: string[];
  onApplyKeywords: (appliedKeywords: string[]) => void;
  onReset: () => void;
  keywordFilterMode: "AND" | "OR";
  onKeywordFilterModeChange: (mode: "AND" | "OR") => void;
}

export function FilterBar({
  searchQuery,
  onSearch,
  selectedRegion,
  // onRegionChange,
  selectedSeason,
  // onSeasonChange,
  selectedKeywords,
  onApplyKeywords,
  onReset,
  keywordFilterMode,
  onKeywordFilterModeChange,
}: FilterBarProps) {
  // "적용 전" draft 상태 관리
  const [selectedKeywordsDraft, setSelectedKeywordsDraft] = useState<string[]>(selectedKeywords);

  // 부모가 바뀌면 draft도 맞춰서 동기화
  useEffect(() => {
    setSelectedKeywordsDraft(selectedKeywords);
  }, [selectedKeywords]);

  const hasFilter =
    selectedRegion !== "all" || selectedSeason !== "all" || selectedKeywords.length > 0;

  const handleBadgeClick = (keyword: string) => {
    setSelectedKeywordsDraft((prev) =>
      prev.includes(keyword) ? prev.filter((k) => k !== keyword) : [...prev, keyword]
    );
  };

  const handleApply = () => {
    onApplyKeywords(selectedKeywordsDraft);
  };

  const handleReset = () => {
    setSelectedKeywordsDraft([]);
    onReset();
  };

  return (
    <div className="mb-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* 검색바 */}
      <SearchBar onSearch={onSearch} defaultValue={searchQuery} />

      <Popover>
        <PopoverTrigger>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            필터
            {hasFilter && (
              <Badge className="ml-1 rounded-full bg-[#ff651b] px-1.5 py-0.5 text-xs text-white">
                필터 적용됨
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4 p-2">
            {/* 지역
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
            계절
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
            </div> */}
            {/* 키워드 + AND/OR 토글 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">키워드</h4>
                <KeywordModeToggle mode={keywordFilterMode} onChange={onKeywordFilterModeChange} />
              </div>
              {/* --- AND/OR 가이드 --- */}
              <div className="flex gap-2 items-center mb-2">
                <span className="text-xs text-gray-400">
                  {keywordFilterMode === "AND"
                    ? "첫 번째 키워드 검색 + 나머지 키워드가 모두 포함된 축제 필터링"
                    : "첫 번째 키워드 검색 + 나머지 키워드 중 하나라도 포함된 축제 필터링"}
                </span>
              </div>
              {/* --- 검색 기준 키워드 구역 --- */}
              <div className="flex flex-wrap items-center gap-1 mb-2 min-h-6">
                {selectedKeywordsDraft.length > 0 && (
                  <>
                    <span className="font-bold text-xs text-gray-500 mr-1">검색 기준: </span>
                    <Badge className="bg-[#ff651b] text-white">{selectedKeywordsDraft[0]}</Badge>
                    {selectedKeywordsDraft.slice(1).map((k, idx) => (
                      <span key={k} className="flex items-center">
                        <span className="mx-1 text-xs font-bold text-gray-400">
                          {keywordFilterMode === "AND"
                            ? idx === 0
                              ? "+" // 두 번째 키워드 앞에는 +
                              : "," // 그 뒤에는 ,
                            : "or"}
                        </span>
                        <Badge className="bg-gray-200 text-gray-700">{k}</Badge>
                      </span>
                    ))}
                  </>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword) => (
                  <Badge
                    key={keyword}
                    variant={selectedKeywordsDraft.includes(keyword) ? "default" : "outline"}
                    className={`cursor-pointer ${
                      selectedKeywordsDraft.includes(keyword)
                        ? "bg-[#ff651b] hover:bg-[#ff651b]"
                        : "hover:bg-gray-300 text-gray-500"
                    }`}
                    onClick={() => handleBadgeClick(keyword)}
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
            {/* 버튼 */}
            <div className="flex justify-between pt-2">
              <Button variant="outline" size="sm" onClick={handleReset}>
                초기화
              </Button>
              <Button
                size="sm"
                className="bg-[#ff651b] hover:bg-[#ff651b]/90 text-[#fffefb]"
                onClick={handleApply}
                disabled={selectedKeywordsDraft.length === 0}
              >
                적용하기
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
