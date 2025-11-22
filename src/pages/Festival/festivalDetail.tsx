"use client";
import { useParams, useNavigate } from "react-router-dom";
import {
  useFestivalOverview,
  useFestivalPeriod,
  useFestivalDetailInfo,
  useLocationFood,  // <- 추가
} from "../../hooks/useFestivalList";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/button";
import Navbar from "../../components/Navbar";
import { Calendar, MapPin, Phone, ImageIcon, Utensils } from "lucide-react";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
function formatDate(dateStr?: string) {
  if (!dateStr || dateStr.length !== 8) return dateStr || "";
  return `${dateStr.slice(0, 4)}.${dateStr.slice(4, 6)}.${dateStr.slice(6, 8)}`;
}

export default function FestivalDetailPage() {
  const { t } = useTranslation();
  const { contentid, contenttypeid } = useParams<{ contentid: string; contenttypeid: string }>();
  const navigate = useNavigate();

  // 축제 정보 fetch
  const { data: infoData, isLoading: infoLoading } = useFestivalOverview(contentid);
  const { data: periodData, isLoading: periodLoading } = useFestivalPeriod(contentid, contenttypeid);
  const { data: detailInfoData, isLoading: detailLoading } = useFestivalDetailInfo(contentid, contenttypeid);

  // 먹거리 fetch (infoData가 있을 때만, 고정 파라미터)
  const { data: foodData, isLoading: foodLoading } = useLocationFood(
    infoData?.mapx && infoData?.mapy
      ? {
          mapx: infoData.mapx,
          mapy: infoData.mapy,
          numOfRows: 4,
          pageNo: 1,
          radius: 10000,
        }
      : { mapx: "", mapy: "" },
    !!infoData?.mapx && !!infoData?.mapy
  );

  // 메인 정보
  const overview = infoData?.overview ?? t("festivalDetail.noOverview");
  const image = infoData?.firstimage ?? "/placeholder.svg";
  const image2 = infoData?.firstimage2;
  const title = infoData?.title ?? "-";
  const tel = infoData?.tel ?? "-";
  // const addr = infoData?.addr1 ?? "" + (infoData?.addr2 ? ` ${infoData.addr2}` : "");
  // const zipcode = infoData?.zipcode ?? "";
  const period = periodData
    ? `${formatDate(periodData.eventstartdate)} ~ ${formatDate(periodData.eventenddate)}`
    : "";
  const eventplace = infoData?.addr2 ?? "";

  // 종료여부
  const ended =
    periodData?.eventenddate &&
    periodData?.eventenddate < new Date().toISOString().slice(0, 10).replace(/-/g, "")
      ? true
      : false;

  // 상세내용
  const intro = detailInfoData?.find((info) => info.infoname === t("festivalDetail.introTitle"))?.infotext || overview;
  const detail = detailInfoData?.find((info) => info.infoname === t("festivalDetail.detailTitle"))?.infotext;

  const [showAll, setShowAll] = useState(false);

  // 로딩 처리
  if (infoLoading || periodLoading || detailLoading)
    return <div className="text-center py-24 text-gray-400">{t("festivalDetail.loading")}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff8f2] via-white to-[#f2fbff]">
      <Navbar />
      {/* 메인 대표 이미지 + 타이틀 */}
      <section className="relative min-h-[340px] md:min-h-[420px] w-full flex items-end bg-[#fff5ea]">
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover opacity-70"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#ffb47b]/80 via-transparent to-transparent" />
        <div className="relative z-10 w-full px-6 pb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow mb-3">{title}</h1>
              <div className="flex gap-2 items-center">
                {ended && <Badge className="bg-gray-500 text-white">{t("festivalDetail.ended")}</Badge>}
                <Badge className="bg-[#ff651b] text-white">{t("festivalDetail.badgeFestival")}</Badge>
                {period && (
                  <span className="ml-3 flex items-center text-white/80">
                    <Calendar className="h-5 w-5 mr-1" />
                    {period}
                  </span>
                )}
              </div>
            </div>
            {/* 행사장소/전화 한줄표시 (PC에서만 오른쪽에) */}
            <div className="hidden md:flex flex-col items-end gap-2">
              {eventplace && (
                <span className="flex items-center text-white/90 text-lg">
                  <MapPin className="h-5 w-5 mr-1" />
                  {eventplace}
                </span>
              )}
              {tel && (
                <span className="flex items-center text-white/80 text-base">
                  <Phone className="h-5 w-5 mr-1" />
                  {tel}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 메인 콘텐츠 */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* 개요/소개(overview) */}
        <section className="mb-8">
          <div className="rounded-xl shadow-md bg-[#fffefb] border px-6 py-6 flex flex-col md:flex-row gap-4 items-center">
            <ImageIcon className="w-14 h-14 text-[#ffb47b]" />
            <div>
              <h2 className="text-xl font-semibold text-[#ff651b] mb-1">{t("festivalDetail.summaryTitle")}</h2>
              <p className="text-gray-800 text-base whitespace-pre-line">{overview}</p>
            </div>
          </div>
        </section>
        {/* 추가 이미지(있으면) */}
        {image2 && (
          <section className="mb-8">
            <div className="w-full aspect-[4/3] rounded-xl overflow-hidden shadow">
              <img
                src={image}
                alt={`${title} ${t("festivalDetail.scenePhoto")}`}
                className="object-cover w-full h-full"
                loading="lazy"
              />
            </div>
          </section>
        )}
        {/* 행사장소, 연락처, 주소 등 정보 */}
        <div className="mb-6 flex flex-col gap-2 text-gray-700 text-base">
          {eventplace && (
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-1 text-[#ff651b]" />
              <span className="font-medium">{eventplace}</span>
            </div>
          )}
          {/* {addr && (
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-1 text-[#ff651b]" />
              <span>
                {addr} {zipcode && <span>({zipcode})</span>}
              </span>
            </div>
          )} */}
          {tel && (
            <div className="flex items-center">
              <Phone className="h-5 w-5 mr-1 text-[#ff651b]" />
              <span>{tel}</span>
            </div>
          )}
        </div>
        {/* 행사소개 */}
        {intro && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2 text-[#ff651b]">{t("festivalDetail.introTitle")}</h2>
            <div className="bg-[#fffefb] rounded-xl p-5 text-gray-900 shadow">{intro}</div>
          </section>
        )}
        {/* 행사내용 */}
        {detail && (
          <section >
            <h2 className="text-xl font-semibold mb-2 text-[#ff651b]">{t("festivalDetail.detailTitle")}</h2>
            <div
              className={`bg-[#fffefb] rounded-xl p-5 text-gray-900 shadow transition-all mb-2 ${
                showAll ? "" : "line-clamp-4 overflow-auto "
              }`}
              style={{ wordBreak: "break-all" }}
              dangerouslySetInnerHTML={{ __html: detail }}
            />
            {/* 전체보기/접기 버튼 */}
            <div className="mt-2 text-right">
              <button
                className="text-[#ff651b] text-sm font-semibold hover:underline"
                onClick={() => setShowAll((v) => !v)}
              >
                {showAll ? t("festivalDetail.collapse") : t("festivalDetail.showAll")}
              </button>
            </div>
          </section>
        )}
        {/* 근처 먹거리 추천 */}
        <section className="mt-10">
          <h2 className="text-lg font-bold text-[#ff651b] flex items-center mb-4">
            <Utensils className="w-6 h-6 mr-2" />
            {t("festivalDetail.foodTitle")}
          </h2>
          {foodLoading ? (
            <div className="text-gray-400 text-center py-6">{t("festivalDetail.foodLoading")}</div>
          ) : foodData && foodData.length > 0 ? (
            <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              {foodData.map((food) => (
                <li
                  key={food.contentid}
                  className="bg-white rounded-lg shadow border flex flex-col items-center p-4"
                >
                  <img
                    src={food.firstimage || "/placeholder.svg"}
                    alt={food.title}
                    className="w-full aspect-[4/3] object-cover rounded mb-2"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes("/placeholder.svg")) {
                        target.src = "/placeholder.svg";
                      }
                    }}
                  />
                  <div className="font-bold text-gray-900 mb-1 text-lg">{food.title}</div>
                  <div className="text-gray-600 text-sm mb-1">{food.addr1}</div>
                  <div className="text-gray-400 text-xs mb-1">
                    {food.dist && `${Math.round(Number(food.dist))}${t("festivalDetail.meter")}`}
                  </div>
                  {food.tel && <div className="text-xs text-gray-500">{food.tel}</div>}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-400 text-center py-6">{t("festivalDetail.foodNotFound")}</div>
          )}
        </section>
        {/* 뒤로가기 */}
        <div className="mt-10 flex justify-between">
          <Button variant="outline" onClick={() => navigate(-1)}>
            ← {t("festivalDetail.backToList")}
          </Button>
        </div>
      </main>
    </div>
  );
}
