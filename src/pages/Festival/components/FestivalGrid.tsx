import { useState,  useEffect } from "react";
import { useFestivalOverview, useFestivalPeriod } from "../../../hooks/useFestivalList";
import { Link } from "react-router-dom";
import { Heart, MapPin, Calendar } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/Badge";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
// 타입 선언
export type Festival = {
  id: string;
  contentid: string;
  contenttypeid: string;
  name: string;
  location: string;
  period: string;
  image: string;
  image2?: string;
  keywords: string[];
  description: string;
  featured?: boolean;
  ended?: boolean; // 종료 여부
};
export type DetailsMap = {
  [id: string]: {
    period: string;
    description: string;
    eventenddate?: string;
  };
};

// 날짜 포맷터
function formatDate(dateStr?: string) {
  if (!dateStr || dateStr.length !== 8) return dateStr || "";
  return `${dateStr.slice(0, 4)}.${dateStr.slice(4, 6)}.${dateStr.slice(6, 8)}`;
}

// // 종료여부 판단 함수
// function isFestivalEnded(eventenddate?: string): boolean {
//   if (!eventenddate || eventenddate.length !== 8) return false;
//   const today = new Date();
//   const y = today.getFullYear();
//   const m = String(today.getMonth() + 1).padStart(2, "0");
//   const d = String(today.getDate()).padStart(2, "0");
//   const todayStr = `${y}${m}${d}`; // "20240606"
//   return eventenddate < todayStr;
// }

interface FestivalGridProps {
  festivals: Festival[];
  onUpdateDetails: React.Dispatch<React.SetStateAction<DetailsMap>>;
}

// 내부 FestivalCard 선언 (여기서 fetch!)
function FestivalCard({
  festival,
  onUpdateDetails,
}: {
  festival: Festival;
  onUpdateDetails: FestivalGridProps["onUpdateDetails"];
}) {
  const [liked, setLiked] = useState(false);
  const { t } = useTranslation();
  // 상세정보 패치
  const { data: infoData, isLoading: infoLoading } = useFestivalOverview(festival.contentid);
  const { data: periodData, isLoading: periodLoading } = useFestivalPeriod(
    festival.contentid,
    festival.contenttypeid
  );

  const overview = infoData?.overview ?? festival.description ?? "";
  const eventStart = periodData?.eventstartdate ?? "";
  const eventEnd = periodData?.eventenddate ?? "";
  const formattedPeriod =
    eventStart && eventEnd
      ? `${formatDate(eventStart)} ~ ${formatDate(eventEnd)}`
      : festival.period || t("festivalGrid.noPeriod");

  // 종료 여부 계산
  // const ended = isFestivalEnded(eventEnd);

  // fetch된 값이 있으면 상위로 올려줌 (부모 state 업데이트)
  useEffect(() => {
    if (!infoLoading && !periodLoading && (overview || formattedPeriod)) {
      onUpdateDetails((prev) =>
        prev[festival.id]?.period === formattedPeriod &&
        prev[festival.id]?.description === overview &&
        prev[festival.id]?.eventenddate === eventEnd
          ? prev
          : {
              ...prev,
              [festival.id]: {
                period: formattedPeriod,
                description: overview,
                eventenddate: eventEnd,
              },
            }
      );
    }
  }, [infoLoading, periodLoading, formattedPeriod, overview, festival.id, eventEnd, onUpdateDetails]);
 
  return (
    <div
      className={`group relative overflow-hidden rounded-xl bg-[#fffefb] transition-all hover:shadow-lg ${
        festival.featured
          ? "ring-[1.7px] ring-[#ff651b] ring-offset-2"
          : "ring-[1.7px] ring-gray-600 ring-offset-2"
      }`}
    >
      <Link to={`/festival/${festival.contentid}/${festival.contenttypeid}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <img
            src={festival.image || "/placeholder.svg"}
            alt={festival.name}
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://placehold.co/500x500/e2e8f0/64748b?text=Festival+Image";
            }}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
          {/* 추천 뱃지 */}
          {festival.featured && !festival.ended &&(
            <div className="absolute left-3 top-3 z-10">
              <Badge className="bg-[#ff651b] text-white">{t("festivalGrid.badgeFeatured")}</Badge>
            </div>
          )}
          {/* 종료 뱃지 */}
          {festival.ended && (
            <div className="absolute right-3 top-3 z-10">
              <Badge className="bg-gray-500 text-white">{t("festivalGrid.badgeEnded")}</Badge>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
        </div>
        <div className="relative p-5">
          <h3 className="mb-2 text-xl font-bold text-gray-900 line-clamp-3">{festival.name}</h3>
          <div className="mb-3 flex flex-col space-y-1">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="mr-1 h-[20px] w-[20px] text-[#ff651b]" />
              {festival.location || t("festivalGrid.noLocation")}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="mr-1 h-4 w-4 text-[#ff651b]" />
              {periodLoading ? (
                <span className="animate-pulse text-gray-400">{t("festivalGrid.loadingPeriod")}</span>
              ) : (
                formattedPeriod
              )}
            </div>
          </div>
          <p className="mb-4 line-clamp-2 text-sm text-gray-600">
            {infoLoading ? (
              <span className="animate-pulse text-gray-400">{t("festivalGrid.loadingDesc")}</span>
            ) : (
              overview || t("festivalGrid.noDescription")
            )}
          </p>
          <div className="flex flex-wrap gap-1">
            {/* {(festival.keywords ?? []).slice(0, 3).map((keyword) => (
              <Badge key={keyword} variant="outline" className="text-xs text-gray-700">
                {keyword}
              </Badge>
            ))} */}
            {/* {festival.keywords && festival.keywords.length > 3 && (
              <Badge variant="outline" className="text-xs text-gray-700">
                +{festival.keywords.length - 3}
              </Badge>
            )} */}
          </div>
        </div>
      </Link>
      <Button
        variant="ghost"
        size="icon"
        className={`absolute right-3 bottom-3 z-10 rounded-full bg-white/80 opacity-80 transition-opacity hover:bg-white group-hover:opacity-100 ${
          liked ? "text-rose-500" : "text-gray-700"
        }`}
        onClick={(e) => {
          e.preventDefault();
          setLiked((v) => !v);
        }}
      >
        <motion.span
          initial={false}
          animate={{
            scale: liked ? [1, 1.3] : 1,
            rotate: liked ? [0, 0] : 0,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 10, duration: 0.2 }}
          whileTap={{ scale: 0.3 }}
          style={{ display: "inline-block" }}
        >
          <Heart
            className="h-5 w-5"
            fill={liked ? "#ff651b" : "none"}
            stroke={liked ? "#ff651b" : "#334155"}
          />
        </motion.span>
        <span className="sr-only">{t("festivalGrid.like")}</span>
      </Button>
    </div>
  );
}

// FestivalGrid
export function FestivalGrid({ festivals, onUpdateDetails }: FestivalGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {festivals.map((festival) => (
        <FestivalCard key={festival.id} festival={festival} onUpdateDetails={onUpdateDetails} />
      ))}
    </div>
  );
}
