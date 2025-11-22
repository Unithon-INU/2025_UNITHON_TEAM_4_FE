
import { useEffect, useState, useRef, useMemo } from "react";
import { PeriodSelectorBar } from "./components/PeriodSelcectorBar";
import { FestivalGrid, Festival, DetailsMap } from "./components/FestivalGrid";
import Navbar from "../../components/Navbar";
import { useInfiniteFestivalList } from "../../hooks/useFestivalList";
import { useBottomObserver } from "../../hooks/useBottomObserver";
import { useTranslation } from "react-i18next";

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

function formatDateToYYYYMMDD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

const normalizeDateString = (dateStr?: string) => {
  if (!dateStr) return undefined;
  const cleaned = dateStr.replace(/-/g, "");
  return cleaned.length === 8 ? cleaned : undefined;
};

const formatDate = (dateStr?: string) => {
  const normalized = normalizeDateString(dateStr);
  if (!normalized) return dateStr || "";
  return `${normalized.slice(0, 4)}.${normalized.slice(4, 6)}.${normalized.slice(6, 8)}`;
};

const getTodayStr = () => {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
};

export default function FestivalPeriodPage() {
  const { t } = useTranslation();
  const regionToAreaCode = useMemo(
    () =>
      Object.entries(areaCodeMap).reduce((acc, [code, name]) => {
        acc[name] = code;
        return acc;
      }, {} as Record<string, string>),
    []
  );

  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [detailsMap, setDetailsMap] = useState<DetailsMap>({});

  const [searchParams, setSearchParams] = useState({});

  const handleSearch = () => {
    setSearchParams({
      areaCode:
        selectedRegion !== "all" && regionToAreaCode[selectedRegion]
          ? regionToAreaCode[selectedRegion]
          : undefined,
      eventStartDate: selectedStartDate ? formatDateToYYYYMMDD(selectedStartDate) : undefined,
      eventEndDate: selectedEndDate ? formatDateToYYYYMMDD(selectedEndDate) : undefined,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const { data: apiFestivals, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useInfiniteFestivalList(searchParams);

  const allFestivalData: Festival[] = apiFestivals?.pages
    ? apiFestivals.pages.flatMap((page) =>
      page.item.map((item) => {
          const eventStart = item.eventstartdate;
          const eventEnd = item.eventenddate;
          return {
            id: item.contentid,
            contentid: item.contentid,
            contenttypeid: item.contenttypeid,
            areacode: item.areacode,
            name: item.title,
            location:
              (areaCodeMap[item.areacode] || "미정") +
              (item.addr1 ? ` ${item.addr1}` : "") +
              (item.addr2 ? `, ${item.addr2}` : ""),
            eventstartdate: eventStart,
            eventenddate: eventEnd,
            period:
              eventStart && eventEnd
                ? `${formatDate(eventStart)} ~ ${formatDate(eventEnd)}`
                : t("festivalGrid.noPeriod"),
            image: item.firstimage ?? "",
            image2: item.firstimage2 ?? "",
            keywords: item.areacode ? [areaCodeMap[item.areacode]] : [],
            description: item.overview ?? "",
            ended:
              normalizeDateString(eventEnd) !== undefined
                ? normalizeDateString(eventEnd)! < getTodayStr()
                : false,
            featured: false,
          };
        })
      )
    : [];

  const festivalsWithDetails: Festival[] = allFestivalData.map((f) => ({
    ...f,
    period: detailsMap[f.id]?.period ?? f.period,
    description: detailsMap[f.id]?.description ?? f.description,
    eventenddate: detailsMap[f.id]?.eventenddate ?? f.eventenddate,
    eventstartdate: detailsMap[f.id]?.eventstartdate ?? f.eventstartdate,
  }));

  const bottomRef = useBottomObserver(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, hasNextPage);

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

  const totalCount = useMemo(() => {
    if (!apiFestivals?.pages || apiFestivals.pages.length === 0) return 0;
    return apiFestivals.pages[0].totalCount;
  }, [apiFestivals]);

  if (isLoading) {
    return (
      <div className="flex h-60 flex-col items-center justify-center border rounded-lg text-center">
        <p className="mb-4 text-gray-500">{t("periodPage.loading")}</p>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex h-60 flex-col items-center justify-center border rounded-lg text-center">
        <p className="mb-4 text-rose-500">{t("periodPage.error")}</p>
        <button className="w-auto h-auto text-gray-600" onClick={() => window.location.reload()}>
          <div className="text-gray-600">{t("periodPage.back")}</div>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-screen-xl mx-auto px-4 pt-28 pb-12">
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
              {t("periodPage.headline")}
            </h1>
            <p className="text-lg text-gray-600">{t("periodPage.desc")}</p>
          </div>
        </div>

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

        {isScrolled && isExpanded && (
          <div className="fixed inset-0 bg-black/20 z-30" onClick={() => setIsExpanded(false)} />
        )}

        <main className="container py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {totalCount > 0 ? (
              <>
                <span className="text-[#ff651b]">{t("periodPage.count", { count: totalCount })}</span>
                {t("periodPage.result")}
              </>
            ) : (
              t("periodPage.noResult")
            )}
          </h2>
          {totalCount > 0 ? (
            <>
              <FestivalGrid festivals={festivalsWithDetails} onUpdateDetails={setDetailsMap} />
              <div ref={bottomRef} style={{ height: 48 }} />
              {isFetchingNextPage && (
                <div className="text-center text-gray-400 text-sm py-4">
                  {t("periodPage.moreLoading")}
                </div>
              )}
              {!hasNextPage && (
                <div className="text-center text-gray-400 text-sm py-4">
                  {t("periodPage.lastFestival")}
                </div>
              )}
            </>
          ) : (
            <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed text-center">
              <div className="mb-4 text-6xl">😢</div>
              <p className="mb-2 text-lg font-medium text-gray-900">{t("periodPage.noResult2")}</p>
              <p className="text-gray-600">{t("periodPage.tryOther")}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
