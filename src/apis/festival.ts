import client, { getApiUrl } from "./client";
import type {
  FestivalDetailIntroResponse,
  FestivalInfoResponse,
  FestivalListResponse,
  FestivalDetailInfoResponse,
  LocationFoodResponse
} from "../types/festival";

// 파라미터 타입 정의
export interface GetFestivalListParams {
  lang?: string;
  numOfRows?: string | number;
  pageNo?: string | number;
  eventStartDate?: string;
  eventEndDate?: string;
  areaCode?: string;
}

/**
 * 축제 리스트 조회 (GET /api/festivals/list)
 * @param params {GetFestivalListParams}
 * @returns Promise<FestivalListItem[]>
 */
export async function fetchFestivalList(params: GetFestivalListParams = {}) {
  const {
    lang,
    numOfRows = 8,
    pageNo = 1,
    eventStartDate = "20250101",
    eventEndDate,
    areaCode = "",
  } = params;

  const res = await client.get<FestivalListResponse>(getApiUrl("/festivals/list"), {
    params: {
      lang,
      numOfRows,
      pageNo,
      eventStartDate,
      eventEndDate,
      areaCode,
    },
  });

  const item = res.data.data.response.body.items.item;
  const totalCount = res.data.data.response.body.totalCount;
  return { item, totalCount };
}

// 1. 축제 검색 (GET /api/festivals/search?keyword=키워드)
export async function fetchFestivalSearch(keyword: string, lang: string, pageNo = 1) {
  const res = await client.get<FestivalListResponse>(getApiUrl("/festivals/search"), {
    params: { keyword, lang, pageNo, numOfRows: 8 },
  });
  const item = res.data.data.response.body.items.item;
  const totalCount = res.data.data.response.body.totalCount;
  return { item, totalCount };
}

// ########################## 축제list overview, period용 API ##########################
// 1. 개별 축제 overview(소개) fetch
export async function fetchFestivalInfo(contentId: string, lang: string) {
  const res = await client.get<FestivalInfoResponse>(getApiUrl("/festivals/info"), {
    params: {
      lang,
      contentId,
    },
  });
  return res.data.data.response.body.items.item[0];
}

// 2. 개별 축제 기간(시작일/종료일) fetch
export async function fetchFestivalPeriod(contentId: string, contentTypeId: string, lang: string) {
  const res = await client.get<FestivalDetailIntroResponse>(getApiUrl("/festivals/detailIntro"), {
    params: {
      lang,
      contentId,
      contentTypeId,
    },
  });
  return res.data.data.response.body.items.item[0];
}
// 행사내용(detailInfo) fetch
export async function fetchFestivalDetailInfo(contentId: string, contentTypeId: string, lang: string) {
  const res = await client.get<FestivalDetailInfoResponse>(getApiUrl("/festivals/detailInfo"), {
    params: {
      lang,
      contentId,
      contentTypeId,
    },
  });
  // item이 배열로 옴
  return res.data.data.response.body.items.item;
}

// 파라미터 타입
export interface GetLocationFoodParams {
  lang?: string;
  mapx: string;
  mapy: string;
  numOfRows?: string | number;
  pageNo?: string | number;
  radius?: string | number;
}

// 근처 먹거리 조회 (GET /api/festivals/locationFood)
export async function fetchLocationFood(params: GetLocationFoodParams) {
  const {
    lang,
    mapx,
    mapy,
    numOfRows = 4,
    pageNo = 1,
    radius = 10000,
  } = params;

  const res = await client.get<LocationFoodResponse>(
    getApiUrl("/festivals/locationFood"),
    {
      params: {
        lang,
        MapX: mapx,
        MapY: mapy,
        NumOfRows: numOfRows,
        PageNo: pageNo,
        Radius: radius,
      },
    }
  );

  // 바로 배열만 리턴
  return res.data.data.response.body.items.item;
}

/** 축제 좋아요/좋아요 취소 (토글) */
export async function toggleFestivalLike({
  contentId,
  title,
  imageUrl,
  address,
}: {
  contentId: string;
  title: string;
  imageUrl: string;
  address: string;
}) {
  // POST /api/v1/festivals/{contentId}like
  const res = await client.post(
    getApiUrl(`/festivals/${contentId}/like`),
    { contentId, title, imageUrl, address }
  );
  return res.data; // { message: '좋아요 추가됨' | '좋아요 취소됨', ... }
}

/** 내가 좋아요한 축제 목록 조회 */
export async function getLikedFestivals() {
  // GET /api/v1/festivals/likes
  const res = await client.get(getApiUrl("/festivals/likes"));
  return res.data; // [{ contentId, title, imageUrl, address }, ...]
}
