import client, { getApiUrl } from "./client";
import type {
  FestivalDetailIntroResponse,
  FestivalInfoResponse,
  FestivalListResponse,
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
    lang = "kor",
    numOfRows = 4,
    pageNo = 1,
    eventStartDate = "20250601",
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
export async function fetchFestivalSearch(keyword: string, lang = "kor", pageNo = 1) {
  const res = await client.get<FestivalListResponse>(getApiUrl("/festivals/search"), {
    params: { keyword, lang, pageNo, numOfRows: 4 },
  });
  const item = res.data.data.response.body.items.item;
  const totalCount = res.data.data.response.body.totalCount;
  return { item, totalCount };
}

// ########################## 축제list overview, period용 API ##########################
// 1. 개별 축제 overview(소개) fetch
export async function fetchFestivalInfo(contentId: string) {
  const res = await client.get<FestivalInfoResponse>(getApiUrl("/festivals/info"), {
    params: {
      lang: "kor",
      contentId,
    },
  });
  return res.data.data.response.body.items.item[0];
}

// 2. 개별 축제 기간(시작일/종료일) fetch
export async function fetchFestivalPeriod(contentId: string, contentTypeId: string) {
  const res = await client.get<FestivalDetailIntroResponse>(getApiUrl("/festivals/detailIntro"), {
    params: {
      lang: "kor",
      contentId,
      contentTypeId,
    },
  });
  return res.data.data.response.body.items.item[0];
}
