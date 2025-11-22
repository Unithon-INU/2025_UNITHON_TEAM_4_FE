
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { Tabs, TabsList, TabsTrigger } from "./components/Tabs";
import { Button } from "../../components/ui/button";
import { FestivalGrid, Festival, DetailsMap } from "./components/FestivalGrid";
import { FilterBar } from "./components/FilterBar";
import { AppliedFilters } from "./components/AppliedFilters";
import { FeaturedFestivalSlider } from "./components/FeaturedFestivalSlider";
import { useInfiniteFestivalList, useInfiniteFestivalSearch } from "../../hooks/useFestivalList";
import { useBottomObserver } from "../../hooks/useBottomObserver";
import { LoadingFestival } from "./LoadingFestival";
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

function getTodayStr() {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
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

export default function FestivalPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [tab, setTab] = useState<"all" | "featured" | "upcoming" | "ongoing">("ongoing");
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("search") ?? "");
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedSeason, setSelectedSeason] = useState("all");
  const [detailsMap, setDetailsMap] = useState<DetailsMap>({});
  const [keywordFilterMode, setKeywordFilterMode] = useState<"AND" | "OR">("OR");
  const { t } = useTranslation();

  useEffect(() => {
    setSearchQuery(searchParams.get("search") ?? "");
  }, [searchParams]);

  const todayStr = getTodayStr();
  let eventStartDate: string | undefined;
  let eventEndDate: string | undefined;

  if (tab === "ongoing") {
    eventStartDate = todayStr;
    eventEndDate = todayStr;
  }

  const filterParams = {
    areaCode: selectedRegion !== "all" ? selectedRegion : undefined,
    eventStartDate,
    eventEndDate,
  };

  const isSearching = searchQuery.trim().length > 0 || selectedKeywords.length > 0;
  const keyword = selectedKeywords[0] || searchQuery.trim() || "";

  const searchResult = useInfiniteFestivalSearch(keyword);
  const listResult = useInfiniteFestivalList(filterParams);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = isSearching
    ? searchResult
    : listResult;

  const isFestivalEnded = (eventenddate?: string): boolean => {
    const normalized = normalizeDateString(eventenddate);
    if (!normalized) return false;
    return normalized < getTodayStr();
  };

  const festivals: Festival[] = useMemo(() => {
    if (!data) return [];

    const allItems = data.pages.flatMap((page) => {
      if (Array.isArray(page)) return page;
      if ("item" in page) return page.item;
      return [];
    });

    const notEndedItems = allItems.filter((item) => {
      const eventEnd = detailsMap?.[item.contentid]?.eventenddate ?? item.eventenddate;
      return !isFestivalEnded(eventEnd);
    });

    const featuredIds = notEndedItems.slice(0, 5).map((item) => item.contentid);

    return allItems.map((item) => {
      const eventStart = detailsMap?.[item.contentid]?.eventstartdate ?? item.eventstartdate;
      const eventEnd = detailsMap?.[item.contentid]?.eventenddate ?? item.eventenddate;
      const ended = isFestivalEnded(eventEnd);

      const periodText =
        eventStart && eventEnd
          ? `${formatDate(eventStart)} ~ ${formatDate(eventEnd)}`
          : t("festivalGrid.noPeriod");

      return {
        id: item.contentid,
        contentid: item.contentid,
        contenttypeid: item.contenttypeid,
        name: item.title,
        location:
          (areaCodeMap[item.areacode] || "미정") +
          (item.addr1 ? ` ${item.addr1}` : "") +
          (item.addr2 ? `, ${item.addr2}` : ""),
        period: periodText,
        eventstartdate: eventStart,
        eventenddate: eventEnd,
        image: item.firstimage ?? "",
        image2: item.firstimage2 ?? "",
        keywords: item.areacode ? [areaCodeMap[item.areacode]] : [],
        description: item.overview ?? "",
        ended,
        featured: !ended && featuredIds.includes(item.contentid),
      };
    });
  }, [data, detailsMap, t]);

  const festivalsWithDetails: Festival[] = useMemo(
    () =>
      festivals.map((f) => ({
        ...f,
        period: detailsMap[f.id]?.period ?? f.period,
        description: detailsMap[f.id]?.description ?? f.description,
        eventenddate: detailsMap[f.id]?.eventenddate ?? f.eventenddate,
        eventstartdate: detailsMap[f.id]?.eventstartdate ?? f.eventstartdate,
      })),
    [festivals, detailsMap]
  );

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
    return filtered;
  }, [festivalsWithDetails, selectedKeywords, selectedRegion, selectedSeason, keywordFilterMode]);

  const handleUpdateDetails: React.Dispatch<React.SetStateAction<DetailsMap>> = setDetailsMap;

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedRegion("all");
    setSelectedSeason("all");
    setSelectedKeywords([]);
    setDetailsMap({});
    setTab("all");
  };

  const handleApplyKeywords = (appliedKeywords: string[]) => {
    setSelectedKeywords(appliedKeywords);
    setSearchQuery("");
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSearchParams({ search: query });
    setSelectedKeywords([]);
  };

  const bottomRef = useBottomObserver(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, hasNextPage);

  const totalCount = useMemo(() => {
    if (!data) return 0;
    const firstPage = data.pages[0];
    if (Array.isArray(firstPage)) return firstPage.length;
    if ("totalCount" in firstPage) return firstPage.totalCount;
    return 0;
  }, [data]);

  if (isLoading) return <LoadingFestival />;
  if (isError)
    return (
      <div className="flex h-60 flex-col items-center justify-center border rounded-lg text-center">
        <p className="mb-4 text-rose-500">{t("festival.loadError")}</p>
        <Button variant="outline" onClick={resetFilters}>
          {t("festival.backToList")}
        </Button>
      </div>
    );

  const featuredFestivals = festivalsWithDetails.filter((f) => f.featured);

  return (
    <div className="min-h-screen bg-[#fffefb]">
      <Navbar />
      <main className="max-w-screen-xl mx-auto px-4 pt-28 pb-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold md:text-4xl text-[#1f2328]">{t("festival.title")}</h1>
        </div>
        <FeaturedFestivalSlider festivals={featuredFestivals} />
        <div className=" -mt-11 flex flex-row justify-between items-center">
          <p className="ml-6 mb-4 font-semibold text-lg text-[#1f2328]/90">
            <span className="text-[#ff651b]">{t("festival.count", { count: totalCount })}</span>
            {t("festival.result")}
          </p>
          <AppliedFilters
            selectedRegion={selectedRegion}
            selectedSeason={selectedSeason}
            selectedKeywords={selectedKeywords}
            onReset={resetFilters}
          />
        </div>
        <div className="relative mb-1">
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

        {!(searchQuery.trim().length > 0 || selectedKeywords.length > 0) && (
          <Tabs value={tab} onValueChange={setTab as (value: string) => void}>
            <TabsList>
              <TabsTrigger value="all">{t("festival.allTab")}</TabsTrigger>
              <TabsTrigger value="ongoing">{t("festival.ongoingTab")}</TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {filteredFestivals.length > 0 ? (
          <>
            <FestivalGrid festivals={filteredFestivals} onUpdateDetails={handleUpdateDetails} />
            <div ref={bottomRef} style={{ height: 48 }} />
            {isFetchingNextPage && <LoadingFestival />}
            {!hasNextPage && (
              <div className="text-center text-gray-400 text-sm py-4">
                {t("festival.lastFestival")}
              </div>
            )}
          </>
        ) : (
          <div className="flex h-60 flex-col items-center justify-center border rounded-lg text-center">
            <p className="mb-4 text-gray-500">{t("festival.noResult")}</p>
            <Button variant="outline" onClick={resetFilters}>
              {t("festival.resetAll")}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}