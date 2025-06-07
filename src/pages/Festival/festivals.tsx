"use client";

import { useState, useMemo } from "react";
import Navbar from "../../components/Navbar/index";
import { Tabs, TabsList, TabsTrigger } from "./components/Tabs";
import { Button } from "../../components/ui/button";
import { FestivalGrid, Festival, DetailsMap } from "./components/FestivalGrid";
import { FilterBar } from "./components/FilterBar";
import { AppliedFilters } from "./components/AppliedFilters";
import { FeaturedFestivalSlider } from "./components/FeaturedFestivalSlider";
import { useInfiniteFestivalList, useInfiniteFestivalSearch } from "../../hooks/useFestivalList";
import { useBottomObserver } from "../../hooks/useBottomObserver";
import {LoadingFestival} from "./LoadingFestival"; // 로딩 컴포넌트 (스켈레톤)
const areaCodeMap: Record<string, string> = {
  "1": "서울", "2": "인천", "3": "대전", "4": "대구", "5": "광주", "6": "부산",
  "7": "울산", "8": "세종", "31": "경기도", "32": "강원도", "33": "충청북도",
  "34": "충청남도", "35": "경상북도", "36": "경상남도", "37": "전라북도", "38": "전라남도", "39": "제주도",
};

export default function FestivalPage() {
  // 상태
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedSeason, setSelectedSeason] = useState("all");
  const [detailsMap, setDetailsMap] = useState<DetailsMap>({});
  const [keywordFilterMode, setKeywordFilterMode] = useState<"AND" | "OR">("OR");

  // --- 필터 파라미터 (areaCode만 샘플, 필요에 따라 확장)
  const filterParams = {
    areaCode: selectedRegion !== "all" ? selectedRegion : undefined,
  };

  // --- 무한스크롤 핵심: 검색/리스트 구분
  const isSearching = searchQuery.trim().length > 0 || selectedKeywords.length > 0;
  const keyword = selectedKeywords[0] || searchQuery.trim() || "";

  
  // 훅을 무조건 둘 다 호출
const searchResult = useInfiniteFestivalSearch(keyword);
const listResult = useInfiniteFestivalList(filterParams);

// 조건에 따라 사용할 값만 선택
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  isError,
} = isSearching ? searchResult : listResult;

  // 데이터 누적(flat)
  const festivals: Festival[] = useMemo(() => {
    if (!data) return [];
    return data.pages.flat().map((item, idx) => ({
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
  }, [data]);

  // 상세 정보(detailsMap) 반영
  const festivalsWithDetails: Festival[] = useMemo(
    () =>
      festivals.map((f) => ({
        ...f,
        period: detailsMap[f.id]?.period ?? f.period,
        description: detailsMap[f.id]?.description ?? f.description,
      })),
    [festivals, detailsMap]
  );

  // --- 필터/계절/ANDOR (기존 필터는 데이터 누적 후 클라이언트에서 처리)
  const filteredFestivals: Festival[] = useMemo(() => {
    let filtered = festivalsWithDetails;
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
    if (selectedRegion !== "all") {
      filtered = filtered.filter((festival) => festival.location.includes(selectedRegion));
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
    return filtered;
  }, [festivalsWithDetails, selectedKeywords, selectedRegion, selectedSeason, keywordFilterMode]);

  // --- 상세 fetch map 연결
  const handleUpdateDetails: React.Dispatch<React.SetStateAction<DetailsMap>> = setDetailsMap;

  // --- 필터/검색 리셋
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedRegion("all");
    setSelectedSeason("all");
    setSelectedKeywords([]);
    setDetailsMap({});
    // 무한스크롤에선 festivals가 자동 초기화됨
  };

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

  // --- 무한스크롤: IntersectionObserver 하단 div
  const bottomRef = useBottomObserver(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, hasNextPage);

  // --- 에러/로딩 처리
  if (isLoading) return <LoadingFestival />;
  if (isError)
    return (
      <div className="flex h-60 flex-col items-center justify-center border rounded-lg text-center">
        <p className="mb-4 text-rose-500">축제 데이터를 불러오지 못했습니다.</p>
        <Button variant="outline" onClick={resetFilters}>
          전체 목록으로 돌아가기
        </Button>
      </div>
    );

  // --- 추천 슬라이더
  const featuredFestivals = festivalsWithDetails.filter((f) => f.featured);

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
          <>
            <FestivalGrid festivals={filteredFestivals} onUpdateDetails={handleUpdateDetails} />
            <div ref={bottomRef} style={{ height: 48 }} />
            {isFetchingNextPage && <LoadingFestival />}
            {!hasNextPage && (
              <div className="text-center text-gray-400 text-sm py-4">마지막 축제입니다.</div>
            )}
          </>
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
