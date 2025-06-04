"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PeriodSelectorBar } from "./components/PeriodSelcectorBar";
import { FestivalGrid, Festival, DetailsMap } from "./components/FestivalGrid";
import Navbar from "../../components/Navbar";
import { useFestivalList } from "../../hooks/useFestivalList";

// 지역 코드 매핑
const areaCodeMap: Record<string, string> = {
  "1": "서울", "2": "인천", "3": "대전", "4": "대구", "5": "광주", "6": "부산", "7": "울산", "8": "세종",
  "31": "경기도", "32": "강원도", "33": "충청북도", "34": "충청남도", "35": "경상북도",
  "36": "경상남도", "37": "전라북도", "38": "전라남도", "39": "제주도",
};

export default function FestivalPeriodPage() {
  // API 실데이터 fetch
  const { data: apiFestivals, isLoading, isError } = useFestivalList();

  // 상세 fetch 결과 저장
  const [detailsMap, setDetailsMap] = useState<DetailsMap>({});

  // 카드용 정제 데이터
  const allFestivalData: Festival[] = useMemo(() => {
    if (!apiFestivals) return [];
    return apiFestivals.map((item) => ({
      id: item.contentid,
      contentid: item.contentid,
      contenttypeid: item.contenttypeid,
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
      featured: false,
    }));
  }, [apiFestivals]);

  // 필터 상태
  const [filteredFestivals, setFilteredFestivals] = useState<Festival[]>([]);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [selectedRegion, setSelectedRegion] = useState("all");

  // 스크롤 이벤트
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = 1;
      const shouldScroll = window.scrollY > threshold;
      setIsScrolled(shouldScroll);

      if (!shouldScroll) setIsExpanded(false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 기간/지역 필터
  const handleSearch = () => {
    let filtered = allFestivalData;

    if (selectedStartDate && selectedEndDate) {
      filtered = filtered.filter((festival) => {
        // 상세 fetch가 끝났으면 detailsMap.period 파싱해서 비교, 아니면 임시 날짜(추후 API 확장)
        // period: "2024.07.15 ~ 2024.07.24" 형식 가정
        const periodStr = detailsMap[festival.id]?.period ?? festival.period;
        const [start, end] = periodStr.split("~").map((d) => d.trim());
        // 날짜 포매팅 함수 필요
        const toDate = (str: string) => {
          const parts = str.split(".");
          return parts.length === 3 ? new Date(`${parts[0]}-${parts[1]}-${parts[2]}`) : null;
        };
        const festivalStart = toDate(start);
        const festivalEnd = toDate(end);
        if (!festivalStart || !festivalEnd) return false;
        return (
          festivalStart <= selectedEndDate! && festivalEnd >= selectedStartDate!
        );
      });
    }

    if (selectedRegion !== "all") {
      filtered = filtered.filter((festival) => festival.location.includes(selectedRegion));
    }

    setFilteredFestivals(filtered);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsExpanded(false);
  };

  // fetch 데이터 준비/변경 시, 필터 결과도 반영
  useEffect(() => {
    setFilteredFestivals(
      allFestivalData.map((f) => ({
        ...f,
        period: detailsMap[f.id]?.period ?? f.period,
        description: detailsMap[f.id]?.description ?? f.description,
      }))
    );
  }, [allFestivalData, detailsMap]);

  // 로딩/에러 처리
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-screen-xl mx-auto px-4 pt-28 pb-12">
        {/* 상단 인트로 */}
        <div
          ref={headerRef}
          className={`transition-all duration-500 ease-out overflow-hidden  ${
            isScrolled && !isExpanded
              ? "opacity-0 -translate-y-full max-h-0 py-0"
              : "opacity-100 translate-y-0 max-h-96 py-12"
          }`}
        >
          <div className="text-center container">
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl mb-4">
              언제 떠나고 싶으신가요?
            </h1>
            <p className="text-lg text-gray-600">
              원하는 기간을 선택하고 그 시기에 열리는 특별한 축제들을 발견해보세요
            </p>
          </div>
        </div>

        {/* 기간선택 바 */}
        <div
          className={`sticky top-16 z-40 transition-all duration-100 ease-out ${
            isScrolled && !isExpanded
              ? "bg-white/0 backdrop-blur-none  transform translate-y-3"
              : "bg-transparent transform -translate-y-4"
          }`}
        >
          <PeriodSelectorBar
            isCompact={isScrolled && !isExpanded}
            isExpanded={isExpanded}
            selectedStartDate={selectedStartDate}
            selectedEndDate={selectedEndDate}
            selectedRegion={selectedRegion}
            onStartDateChange={setSelectedStartDate}
            onEndDateChange={setSelectedEndDate}
            onRegionChange={setSelectedRegion}
            onExpandClick={() => setIsExpanded(true)}
            onCollapseClick={() => setIsExpanded(false)}
            onSearch={handleSearch}
          />
        </div>

        {/* 확장된 상태일 때 배경 오버레이 */}
        {isScrolled && isExpanded && (
          <div className="fixed inset-0 bg-black/20 z-30" onClick={() => setIsExpanded(false)} />
        )}

        {/* 결과 및 그리드 */}
        <main className="container py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {filteredFestivals.length > 0 ? (
              <>
                <span className="text-rose-500">{filteredFestivals.length}개</span>의 축제를 찾았습니다
              </>
            ) : (
              "조건에 맞는 축제가 없습니다"
            )}
          </h2>
          {filteredFestivals.length > 0 ? (
            <FestivalGrid festivals={filteredFestivals} onUpdateDetails={setDetailsMap} />
          ) : (
            <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed text-center">
              <div className="mb-4 text-6xl">🎭</div>
              <p className="mb-2 text-lg font-medium text-gray-900">검색 결과 없음</p>
              <p className="text-gray-600">다른 조건으로 다시 검색해보세요.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
