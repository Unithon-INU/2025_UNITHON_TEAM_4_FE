"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { PeriodSelectorBar } from "./components/PeriodSelcectorBar";
import { FestivalGrid, Festival, DetailsMap } from "./components/FestivalGrid";
import Navbar from "../../components/Navbar";
import { useInfiniteFestivalList } from "../../hooks/useFestivalList";
import { useBottomObserver } from "../../hooks/useBottomObserver";

const areaCodeMap: Record<string, string> = {
  "1": "서울", "2": "인천", "3": "대전", "4": "대구", "5": "광주", "6": "부산", "7": "울산", "8": "세종",
  "31": "경기도", "32": "강원도", "33": "충청북도", "34": "충청남도", "35": "경상북도",
  "36": "경상남도", "37": "전라북도", "38": "전라남도", "39": "제주도",
};

// 날짜 YYYYMMDD 포맷 변환 함수
function formatDateToYYYYMMDD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

export default function FestivalPeriodPage() {
  const regionToAreaCode = useMemo(
  () =>
    Object.entries(areaCodeMap).reduce((acc, [code, name]) => {
      acc[name] = code;
      return acc;
    }, {} as Record<string, string>),
  []
);
  // 필터 상태
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [detailsMap, setDetailsMap] = useState<DetailsMap>({});

  // 🔵 API 파라미터 관리 (onSearch 누를 때만 반영)
  const [searchParams, setSearchParams] = useState({});

  // "검색" 버튼 클릭 → API 파라미터 갱신
  const handleSearch = () => {
    setSearchParams({
      areaCode: selectedRegion !== "all" && regionToAreaCode[selectedRegion]
    ? regionToAreaCode[selectedRegion]
    : undefined,
      eventStartDate: selectedStartDate ? formatDateToYYYYMMDD(selectedStartDate) : undefined,
      eventEndDate: selectedEndDate ? formatDateToYYYYMMDD(selectedEndDate) : undefined,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  // 무한스크롤 API
  const {
    data: apiFestivals,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteFestivalList(searchParams);

  // 데이터 가공
  const allFestivalData: Festival[] = apiFestivals?.pages
  ? apiFestivals.pages.flatMap((page) =>
      page.item.map((item) => ({
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
        featured: false,
      }))
    )
  : [];

  // detailsMap 적용 (소개/기간 동기화)
  const festivalsWithDetails: Festival[] = allFestivalData.map((f) => ({
    ...f,
    period: detailsMap[f.id]?.period ?? f.period,
    description: detailsMap[f.id]?.description ?? f.description,
  }));

  // 무한스크롤 하단 감지
  const bottomRef = useBottomObserver(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, hasNextPage);

  // 스크롤/헤더/팝오버
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  // (헤더 애니메이션)
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
  const totalCount = useMemo(() => {
  if (!apiFestivals?.pages || apiFestivals.pages.length === 0) return 0;
  // 무조건 첫 페이지의 totalCount를 쓴다 (동일 쿼리 파라미터라면 모든 페이지 totalCount 같음)
  return apiFestivals.pages[0].totalCount;
}, [apiFestivals]);
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
        <button className='w-auto h-auto text-gray-600'
        onClick={() => window.location.reload()}><div className='text-gray-600'>돌아가기</div></button>
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
            onSearch={handleSearch} // **검색시 API 파라미터 갱신**
          />
        </div>

        {/* 확장된 상태일 때 배경 오버레이 */}
        {isScrolled && isExpanded && (
          <div className="fixed inset-0 bg-black/20 z-30" onClick={() => setIsExpanded(false)} />
        )}

        {/* 결과 및 그리드 */}
        <main className="container py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {totalCount > 0 ? (
              <>
                <span className="text-[#ff651b]">{totalCount}개</span>의 축제를 찾았습니다
              </>
            ) : (
              "조건에 맞는 축제가 없습니다"
            )}
          </h2>
          {totalCount > 0 ? (
            <>
              <FestivalGrid festivals={festivalsWithDetails} onUpdateDetails={setDetailsMap} />
              <div ref={bottomRef} style={{ height: 48 }} />
              {isFetchingNextPage && (
                <div className="text-center text-gray-400 text-sm py-4">추가 로딩중...</div>
              )}
              {!hasNextPage && (
                <div className="text-center text-gray-400 text-sm py-4">마지막 축제입니다.</div>
              )}
            </>
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
