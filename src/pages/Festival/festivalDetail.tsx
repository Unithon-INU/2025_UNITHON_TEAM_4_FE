"use client";
import { useParams, useNavigate } from "react-router-dom";
import { useFestivalOverview, useFestivalPeriod, useFestivalDetailInfo } from "../../hooks/useFestivalList";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/button";
import Navbar from "../../components/Navbar";
import { Calendar, MapPin, Phone, ImageIcon } from "lucide-react";

function formatDate(dateStr?: string) {
  if (!dateStr || dateStr.length !== 8) return dateStr || "";
  return `${dateStr.slice(0, 4)}.${dateStr.slice(4, 6)}.${dateStr.slice(6, 8)}`;
}

export default function FestivalDetailPage() {
  const { contentid, contenttypeid } = useParams<{ contentid: string; contenttypeid: string }>();
  const navigate = useNavigate();

  // api fetch
  const { data: infoData, isLoading: infoLoading } = useFestivalOverview(contentid);
  const { data: periodData, isLoading: periodLoading } = useFestivalPeriod(contentid, contenttypeid);
  const { data: detailInfoData, isLoading: detailLoading } = useFestivalDetailInfo(contentid, contenttypeid);

  // 메인 정보
  const overview = infoData?.overview ?? "소개 정보 없음";
  const image = infoData?.firstimage ?? "/placeholder.svg";
  const image2 = infoData?.firstimage2;
  const title = infoData?.title ?? "-";
  const tel = infoData?.tel ?? "-";
  const addr = infoData?.addr1 ?? "" + (infoData?.addr2 ? ` ${infoData.addr2}` : "");
  const zipcode = infoData?.zipcode ?? "";
  const period = periodData
    ? `${formatDate(periodData.eventstartdate)} ~ ${formatDate(periodData.eventenddate)}`
    : "";
  const eventplace = periodData?.eventplace ?? "";

  // 종료여부
  const ended =
    periodData?.eventenddate &&
    periodData?.eventenddate < new Date().toISOString().slice(0, 10).replace(/-/g, "")
      ? true
      : false;

  // 상세내용
  const intro = detailInfoData?.find((info) => info.infoname === "행사소개")?.infotext || overview;
  const detail = detailInfoData?.find((info) => info.infoname === "행사내용")?.infotext;

  // 로딩 처리
  if (infoLoading || periodLoading || detailLoading)
    return <div className="text-center py-24 text-gray-400">로딩중...</div>;

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
                {ended && <Badge className="bg-gray-500 text-white">종료</Badge>}
                <Badge className="bg-[#ff651b] text-white">축제</Badge>
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
        {/* 개요/소개(overview) - 차별화 포인트 */}
        <section className="mb-8">
          <div className="rounded-xl shadow-md bg-[#fffefb] border px-6 py-6 flex flex-col md:flex-row gap-4 items-center">
            <ImageIcon className="w-14 h-14 text-[#ffb47b]" />
            <div>
              <h2 className="text-xl font-semibold text-[#ff651b] mb-1">행사 개요</h2>
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
                alt={`${title} 현장사진`}
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
          {addr && (
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-1 text-[#ff651b]" />
              <span>
                {addr} {zipcode && <span>({zipcode})</span>}
              </span>
            </div>
          )}
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
            <h2 className="text-xl font-semibold mb-2 text-[#ff651b]">행사소개</h2>
            <div className="bg-[#fffefb] rounded-xl p-5 text-gray-900 shadow">{intro}</div>
          </section>
        )}
        {/* 행사내용 */}
        {detail && (
          <section>
            <h2 className="text-xl font-semibold mb-2 text-[#ff651b]">행사내용</h2>
            <div
              className="bg-[#fffefb] rounded-xl p-5 text-gray-900 shadow"
              dangerouslySetInnerHTML={{ __html: detail }}
            />
          </section>
        )}
        {/* 뒤로가기 */}
        <div className="mt-10 flex justify-between">
          <Button variant="outline" onClick={() => navigate(-1)}>
            ← 목록으로
          </Button>
          {/* 지도/홈페이지 등 부가정보 추가 가능 */}
        </div>
      </main>
    </div>
  );
}
