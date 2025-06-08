import client from "./client";
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
  areaCode?: string;
}

/**
 * 축제 리스트 조회 (GET /api/festivals/list)
 * @param params {GetFestivalListParams}
 * @returns Promise<FestivalListItem[]>
 */
export async function fetchFestivalList(params: GetFestivalListParams = {}) {
  const { lang = "kor", numOfRows = 12, pageNo = 1, eventStartDate = "20240701", areaCode = "" } = params;

  // '/api/v1' → '/api'로 baseURL 오버라이드
  const res = await client.get<FestivalListResponse>("/festivals/list", {
    baseURL: import.meta.env.VITE_UNITHON_SERVER_URL.replace(/\/v1$/, ""), // "http://localhost:8080/api"
    params: {
      lang,
      numOfRows,
      pageNo,
      eventStartDate,
      areaCode,
    },
  });

  // 축제 10개 리스트만 반환
  return res.data.data.response.body.items.item;
}
// 1. 축제 검색 (GET /api/festivals/search?keyword=키워드)
export async function fetchFestivalSearch(keyword: string, lang = "kor", pageNo = 1) {
  const res = await client.get<FestivalListResponse>("/festivals/search", {
    baseURL: import.meta.env.VITE_UNITHON_SERVER_URL.replace(/\/v1$/, ""), // "http://localhost:8080/api"

    params: { keyword, lang, pageNo, numOfRows: 12 }, // 페이지당 10개 축제
  });
  // 검색 결과 item 배열만 반환
  return res.data.data.response.body.items.item;
}
// ########################## 축제list overview, period용 API ##########################
// 1. 개별 축제 overview(소개) fetch
export async function fetchFestivalInfo(contentId: string) {
  const res = await client.get<FestivalInfoResponse>("/festivals/info", {
    baseURL: import.meta.env.VITE_UNITHON_SERVER_URL.replace(/\/v1$/, ""), // "http://localhost:8080/api"
    params: {
      lang: "eng", // 일본어로 고정
      contentId,
    },
  });
  // item이 배열이지만, 항상 1개만 들어옴
  return res.data.data.response.body.items.item[0];
}

// 2. 개별 축제 기간(시작일/종료일) fetch
export async function fetchFestivalPeriod(contentId: string, contentTypeId: string) {
  const res = await client.get<FestivalDetailIntroResponse>("/festivals/detailIntro", {
    baseURL: import.meta.env.VITE_UNITHON_SERVER_URL.replace(/\/v1$/, ""), // "http://localhost:8080/api"
    params: {
      lang: "eng", // 일본어로 고정
      contentId,
      contentTypeId,
    },
  });
  // 역시 배열, 1개만 들어옴
  return res.data.data.response.body.items.item[0];
}
