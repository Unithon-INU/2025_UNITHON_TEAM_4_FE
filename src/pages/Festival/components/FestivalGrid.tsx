import { useState, useEffect } from "react";
import { useFestivalOverview, useFestivalPeriod } from "../../../hooks/useFestivalList";
import { Link } from "react-router-dom";
import { Heart, MapPin, Calendar } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/Badge";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import { toggleFestivalLike, getLikedFestivals } from "../../../apis/festival";

// 타입 선언
export type Festival = {
  id: string;
  contentid: string;         // 프론트는 contentid만 사용
  contenttypeid: string;
  name: string;
  location: string;
  period: string;
  image: string;
  image2?: string;
  keywords: string[];
  description: string;
  featured?: boolean;
  ended?: boolean;
};
export type DetailsMap = {
  [id: string]: {
    period: string;
    description: string;
    eventenddate?: string;
  };
};

interface FestivalGridProps {
  festivals: Festival[];
  onUpdateDetails: React.Dispatch<React.SetStateAction<DetailsMap>>;
}

// 날짜 포맷터
function formatDate(dateStr?: string) {
  if (!dateStr || dateStr.length !== 8) return dateStr || "";
  return `${dateStr.slice(0, 4)}.${dateStr.slice(4, 6)}.${dateStr.slice(6, 8)}`;
}

// FestivalGrid
export function FestivalGrid({ festivals, onUpdateDetails }: FestivalGridProps) {
  // contentid 기준으로 좋아요 여부 관리
  const [likedMap, setLikedMap] = useState<{ [contentid: string]: boolean }>({});
  const { i18n } = useTranslation();
  const lang = i18n.language;
  interface LikedFestival {
    contentId: string;
    title: string;
    imageUrl: string;
    address: string;
  }
  // 내 좋아요 목록 fetch
  useEffect(() => {
    getLikedFestivals().then(res => {
      // 응답: [{ contentId: "1234", ... }, ...]
      const map: { [contentid: string]: boolean } = {};
      (res ?? []).forEach((f: LikedFestival) => {
        // contentId → contentid로 변환 (string 일치 보장)
        map[String(f.contentId)] = true;
      });
      setLikedMap(map);
      console.log('초기 likedMap:', map);
    });
  }, []);

  // 좋아요 토글 핸들러
  const handleToggleLike = async (festival: Festival) => {
  try {
    const result = await toggleFestivalLike({
      contentId: festival.contentid,
      title: festival.name,
      imageUrl: festival.image,
      address: lang,
    });
    // 서버 메시지로 alert (or toast)
    // alert(result.message); // or 원하는 방식으로 알림
    // 새로고침으로 완벽하게 동기화
    // 새로고침 대신 likedMap만 갱신
      setLikedMap((prev) => ({
        ...prev,
        [festival.contentid]: !prev[festival.contentid],
      }));
      alert(result.message || (likedMap[String(festival.contentid)] ? "좋아요 취소됨" : "좋아요 추가됨"));
      console.log('업데이트된 likedMap:', { ...likedMap });
  } catch (e) {
    console.error(e);
    alert("좋아요 처리 중 오류가 발생했습니다.");
  }
};


  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {festivals.map((festival) => (
        <FestivalCard
          key={festival.id}
          festival={festival}
          onUpdateDetails={onUpdateDetails}
          liked={!!likedMap[String(festival.contentid)]}
          onLike={() => handleToggleLike(festival)}
        />
      ))}
    </div>
  );
}

// FestivalCard
function FestivalCard({
  festival,
  onUpdateDetails,
  liked,
  onLike,
}: {
  festival: Festival;
  onUpdateDetails: FestivalGridProps["onUpdateDetails"];
  liked: boolean;
  onLike: () => void;
}) {
  const { t } = useTranslation();
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
          {festival.featured && !festival.ended &&(
            <div className="absolute left-3 top-3 z-10">
              <Badge className="bg-[#ff651b] text-white">{t("festivalGrid.badgeFeatured")}</Badge>
            </div>
          )}
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
          onLike();
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
