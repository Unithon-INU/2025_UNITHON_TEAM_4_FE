"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "../../components/Navbar/index";
import { Tabs, TabsList, TabsTrigger } from "./components/Tabs";
import { Button } from "../../components/ui/button";
import { FestivalGrid, Festival, DetailsMap } from "./components/FestivalGrid";
import { FilterBar } from "./components/FilterBar";
import { AppliedFilters } from "./components/AppliedFilters";
import { FeaturedFestivalSlider } from "./components/FeaturedFestivalSlider";
import { useFestivalList } from "../../hooks/useFestivalList";

// 지역 코드 매핑 (고도화는 별도 상수화 추천)
const areaCodeMap: Record<string, string> = {
  "1": "서울", "2": "인천", "3": "대전", "4": "대구", "5": "광주", "6": "부산", "7": "울산", "8": "세종",
  "31": "경기도", "32": "강원도", "33": "충청북도", "34": "충청남도", "35": "경상북도",
  "36": "경상남도", "37": "전라북도", "38": "전라남도", "39": "제주도",
};

export default function FestivalPage() {
  // 1. API 호출
  const { data: apiFestivals, isLoading, isError } = useFestivalList();

  // 2. 상세 fetch값(기간, 설명)을 id별로 저장하는 state
  const [detailsMap, setDetailsMap] = useState<DetailsMap>({});

  // 3. 카드용 데이터로 정제 (최신순+추천플래그)
  const festivalGridData = useMemo<Festival[]>(() => {
    if (!apiFestivals) return [];
    const sorted = apiFestivals
      .slice()
      .sort((a, b) => Number(b.createdtime) - Number(a.createdtime));
    return sorted.map((item, idx) => ({
      id: item.contentid,
      contentid: item.contentid,          // 상세 fetch용
      contenttypeid: item.contenttypeid,  // 상세 fetch용
      name: item.title,
      location:
        (areaCodeMap[item.areacode] || "미정") +
        (item.addr1 ? ` ${item.addr1}` : "") +
        (item.addr2 ? `, ${item.addr2}` : ""),
      period: "기간 정보 없음", // fetch 전 임시
      image: item.firstimage ?? "",
      image2: item.firstimage2 ?? "",
      keywords: item.areacode ? [areaCodeMap[item.areacode]] : [],
      description: item.overview ?? "",
      featured: idx < 5, // 최신 5개만 추천
    }));
  }, [apiFestivals]);

  // 4. 추천(슬라이더)용: fetch된 상세값 반영
  const featuredFestivals = useMemo<Festival[]>(() =>
    festivalGridData
      .filter((f) => f.featured)
      .map((f) => ({
        ...f,
        period: detailsMap[f.id]?.period ?? f.period,
        description: detailsMap[f.id]?.description ?? f.description,
      })),
    [festivalGridData, detailsMap]
  );

  // 5. 전체 카드(필터링), fetch된 상세값 반영
  const allFestivalsWithDetails = useMemo<Festival[]>(() =>
    festivalGridData.map((f) => ({
      ...f,
      period: detailsMap[f.id]?.period ?? f.period,
      description: detailsMap[f.id]?.description ?? f.description,
    })),
    [festivalGridData, detailsMap]
  );

  // --- 필터 상태 (필요시 별도 hooks로 분리 가능) ---
  const [filteredFestivals, setFilteredFestivals] = useState(allFestivalsWithDetails);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedSeason, setSelectedSeason] = useState("all");
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  // fetch값 변경 시 초기화
  useEffect(() => {
    setFilteredFestivals(allFestivalsWithDetails);
  }, [allFestivalsWithDetails]);

  useEffect(() => {
    let filtered = allFestivalsWithDetails;

    if (searchQuery) {
      filtered = filtered.filter(
        (festival) =>
          festival.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          festival.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          festival.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedRegion !== "all") {
      filtered = filtered.filter((festival) =>
        festival.location.toLowerCase().includes(selectedRegion)
      );
    }
    if (selectedSeason !== "all") {
      const seasonKeywords = {
        spring: ["봄"], summer: ["여름"], autumn: ["가을"], winter: ["겨울"],
      };
      filtered = filtered.filter((festival) =>
        festival.keywords.some((keyword) =>
          seasonKeywords[selectedSeason as keyof typeof seasonKeywords].includes(keyword)
        )
      );
    }
    if (selectedKeywords.length > 0) {
      filtered = filtered.filter((festival) =>
        selectedKeywords.some((keyword) => festival.keywords.includes(keyword))
      );
    }
    setFilteredFestivals(filtered);
  }, [searchQuery, selectedRegion, selectedSeason, selectedKeywords, allFestivalsWithDetails]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedRegion("all");
    setSelectedSeason("all");
    setSelectedKeywords([]);
    setFilteredFestivals(allFestivalsWithDetails);
  };

  // --- 렌더링 ---
  if (isLoading) {
    return (
      <div className="flex h-60 flex-col items-center justify-center border rounded-lg text-center">
        <p className="mb-4 text-gray-500">로딩중...</p>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex h-60 flex-col items-center justify-center border rounded-lg text-center">
        <p className="mb-4 text-rose-500">데이터 로드 실패</p>
        <Button variant="outline" onClick={resetFilters}>
          다시 시도
        </Button>
      </div>
    );
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
        {/* 추천 슬라이더: fetch된 값 반영 */}
        <FeaturedFestivalSlider festivals={featuredFestivals} />
        <div className="relative mb-6">
          <FilterBar
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            selectedRegion={selectedRegion}
            onRegionChange={setSelectedRegion}
            selectedSeason={selectedSeason}
            onSeasonChange={setSelectedSeason}
            selectedKeywords={selectedKeywords}
            onToggleKeyword={(k) =>
              setSelectedKeywords((prev) =>
                prev.includes(k) ? prev.filter((i) => i !== k) : [...prev, k]
              )
            }
            onReset={resetFilters}
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
          <FestivalGrid festivals={filteredFestivals} onUpdateDetails={setDetailsMap} />
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
