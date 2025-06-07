"use client";

import { useState, useEffect, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/index";
import { Tabs, TabsList, TabsTrigger } from "./components/Tabs";
import { Button } from "../../components/ui/button";
import { FestivalGrid, Festival, DetailsMap } from "./components/FestivalGrid";
import { FilterBar } from "./components/FilterBar";
import { AppliedFilters } from "./components/AppliedFilters";
import { FeaturedFestivalSlider } from "./components/FeaturedFestivalSlider";
import { useFestivalList } from "../../hooks/useFestivalList";
import { useFestivalSearch } from "../../hooks/useFestivalList";
import { LoadingFestival } from "./LoadingFestival";
const areaCodeMap: Record<string, string> = {
  "1": "서울",
  "2": "인천",
  "3": "대전",
  "4": "대구",
  "5": "광주",
  "6": "부산",
  "7": "울산",
  "8": "세종",
  "31": "경기도",
  "32": "강원도",
  "33": "충청북도",
  "34": "충청남도",
  "35": "경상북도",
  "36": "경상남도",
  "37": "전라북도",
  "38": "전라남도",
  "39": "제주도",
};

export default function FestivalPage() {
  // 상태
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedSeason, setSelectedSeason] = useState("all");
  const [detailsMap, setDetailsMap] = useState<DetailsMap>({});
  const [keywordFilterMode, setKeywordFilterMode] = useState<"AND" | "OR">("OR");

  // API
  const { data: listData, isLoading: listLoading, isError: listError } = useFestivalList();
  const searchKeywordParam =
    selectedKeywords.length > 0 ? selectedKeywords[0] : searchQuery.trim() || undefined;
  const {
    data: searchData,
    isLoading: searchLoading,
    isError: searchError,
  } = useFestivalSearch(searchKeywordParam);

  // 어떤 결과 쓸지 결정
  const isSearching = searchQuery.trim().length > 0 || selectedKeywords.length > 0;
  const apiFestivals = isSearching ? searchData : listData;
  const isLoading = isSearching ? searchLoading : listLoading;
  const isError = isSearching ? searchError : listError;

  // 그리드 데이터
  const festivalGridData: Festival[] = useMemo(() => {
    if (!apiFestivals) return [];
    const sorted = apiFestivals
      .slice()
      .sort((a, b) => Number(b.createdtime) - Number(a.createdtime));
    return sorted.map((item, idx) => ({
      id: item.contentid,
      contentid: item.contentid,
      contenttypeid: item.contenttypeid,
      name: item.title,
      location:
        (areaCodeMap[item.areacode] || "미정") +
        (item.addr1 ? ` ${item.addr1}` : "") +
        (item.addr2 ? `, ${item.addr2}` : ""),
      period: "기간 정보 없음",
      image: item.firstimage ?? "",
      image2: item.firstimage2 ?? "",
      keywords: item.areacode ? [areaCodeMap[item.areacode]] : [],
      description: item.overview ?? "",
      featured: idx < 5,
    }));
  }, [apiFestivals]);

  // 상세 fetch 반영
  const allFestivalsWithDetails: Festival[] = useMemo(
    () =>
      festivalGridData.map((f) => ({
        ...f,
        period: detailsMap[f.id]?.period ?? f.period,
        description: detailsMap[f.id]?.description ?? f.description,
      })),
    [festivalGridData, detailsMap]
  );

  // 필터링
  const [filteredFestivals, setFilteredFestivals] = useState<Festival[]>(allFestivalsWithDetails);
  useEffect(() => {
    let filtered = allFestivalsWithDetails;
    // 키워드 AND/OR 필터
    if (selectedKeywords.length > 0) {
      filtered = filtered.filter((festival) => {
        const text = [festival.name, festival.description, ...(festival.keywords ?? [])]
          .join(" ")
          .toLowerCase();
        return keywordFilterMode === "AND"
          ? selectedKeywords.every((k) => text.includes(k.toLowerCase()))
          : selectedKeywords.some((k) => text.includes(k.toLowerCase()));
      });
    }
    // 지역/계절
    if (selectedRegion !== "all") {
      filtered = filtered.filter((festival) => festival.location.includes(selectedRegion));
    }
    if (selectedSeason !== "all") {
      const seasonKeywords = {
        spring: ["봄"],
        summer: ["여름"],
        autumn: ["가을"],
        winter: ["겨울"],
      };
      filtered = filtered.filter((festival) =>
        festival.keywords.some((keyword) =>
          seasonKeywords[selectedSeason as keyof typeof seasonKeywords].includes(keyword)
        )
      );
    }
    setFilteredFestivals(filtered);
  }, [
    allFestivalsWithDetails,
    selectedRegion,
    selectedSeason,
    selectedKeywords,
    keywordFilterMode,
  ]);

  // 필터/검색 리셋
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedRegion("all");
    setSelectedSeason("all");
    setSelectedKeywords([]);
    setFilteredFestivals(allFestivalsWithDetails);
  };

  // 상세 fetch map 연결
  const handleUpdateDetails: React.Dispatch<React.SetStateAction<DetailsMap>> = setDetailsMap;

  // "적용하기"에서만 키워드 반영
  const handleApplyKeywords = (appliedKeywords: string[]) => {
    setSelectedKeywords(appliedKeywords);
    setSearchQuery("");
  };

  // 검색어 입력
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedKeywords([]);
  };

  // 검색 실패 alert (검색/키워드 상태 + 로딩 끝 + 결과 없음에만)
  useEffect(() => {
    if (isSearching && !isLoading && !isError && filteredFestivals.length === 0) {
      alert("검색 결과가 없습니다. 다른 검색어/키워드를 시도해 보세요!");
    }
  }, [isLoading, isError, filteredFestivals.length, isSearching]);

  // 추천 슬라이더 데이터
  const featuredFestivals = allFestivalsWithDetails.filter((f) => f.featured);

  // const navigate = useNavigate();
  // --- 렌더 ---
  if (isLoading) {
    return <LoadingFestival />;
  }
  if (isError) {
    if (
      window.confirm(
        "검색 결과가 없습니다. 다른 검색어/키워드를 시도해 보세요!\n확인 버튼을 누르면 필터가 초기화됩니다."
      )
    ) {
      // 방법 1: 필터만 초기화
      // resetFilters();
      // return null;

      // 방법 2: /festival로 이동 (페이지 새로고침 느낌)
      window.location.reload();
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fffefb]">
      <Navbar />
      <main className="max-w-screen-xl mx-auto px-4 pt-28 pb-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold md:text-4xl text-[#1f2328]">전국 축제</h1>
          <p className="text-[#1f2328]/70">
            한국의 다양한 지역에서 열리는 특색 있는 축제들을 만나보세요
          </p>
        </div>
        <FeaturedFestivalSlider festivals={featuredFestivals} />
        <div className="relative mb-6">
          <FilterBar
            searchQuery={searchQuery}
            onSearch={handleSearch}
            selectedRegion={selectedRegion}
            onRegionChange={setSelectedRegion}
            selectedSeason={selectedSeason}
            onSeasonChange={setSelectedSeason}
            selectedKeywords={selectedKeywords}
            onApplyKeywords={handleApplyKeywords}
            onReset={resetFilters}
            keywordFilterMode={keywordFilterMode}
            onKeywordFilterModeChange={setKeywordFilterMode}
          />
        </div>
        <AppliedFilters
          selectedRegion={selectedRegion}
          selectedSeason={selectedSeason}
          selectedKeywords={selectedKeywords}
          onReset={resetFilters}
        />
        <Tabs>
          <TabsList>
            <TabsTrigger value="all">전체 축제</TabsTrigger>
            <TabsTrigger value="featured">추천 축제</TabsTrigger>
            <TabsTrigger value="upcoming">다가오는 축제</TabsTrigger>
            <TabsTrigger value="ongoing">진행 중인 축제</TabsTrigger>
          </TabsList>
        </Tabs>
        {filteredFestivals.length > 0 ? (
          <FestivalGrid festivals={filteredFestivals} onUpdateDetails={handleUpdateDetails} />
        ) : (
          <div className="flex h-60 flex-col items-center justify-center border rounded-lg text-center">
            <p className="mb-4 text-gray-500">검색 결과가 없습니다</p>
            <Button variant="outline" onClick={resetFilters}>
              모든 필터 초기화
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
