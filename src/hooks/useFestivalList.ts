// src/hooks/useFestivalList.ts
import { useQuery } from "@tanstack/react-query";
import {
  fetchFestivalInfo,
  fetchFestivalList,
  fetchFestivalPeriod,
  fetchFestivalSearch,
  GetFestivalListParams,
} from "../apis/festival";
import type { FestivalListItem } from "../types/festival";

export function useFestivalList(params: GetFestivalListParams = {}) {
  return useQuery<FestivalListItem[]>({
    queryKey: ["festivals", params],
    queryFn: () => fetchFestivalList(params),
    staleTime: 1000 * 60, // 1분 (옵션)
  });
}
export function useFestivalSearch(keyword?: string, lang = "kor") {
  return useQuery<FestivalListItem[]>({
    queryKey: ["festivalSearch", keyword, lang],
    queryFn: () => fetchFestivalSearch(keyword!, lang),
    enabled: !!keyword, // keyword 있을 때만 호출
    staleTime: 1000 * 60, // 1분
  });
}

// 소개(overview)
export function useFestivalOverview(contentId?: string) {
  return useQuery({
    queryKey: ["festivalOverview", contentId],
    queryFn: () => fetchFestivalInfo(contentId!),
    enabled: !!contentId,
    staleTime: 1000 * 60, // 1분 캐싱(원하면 조정)
  });
}

// 기간(시작,종료일)
export function useFestivalPeriod(contentId?: string, contentTypeId?: string) {
  return useQuery({
    queryKey: ["festivalPeriod", contentId, contentTypeId],
    queryFn: () => fetchFestivalPeriod(contentId!, contentTypeId!),
    enabled: !!contentId && !!contentTypeId,
    staleTime: 1000 * 60,
  });
}
