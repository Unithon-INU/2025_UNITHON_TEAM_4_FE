// src/hooks/useFestivalList.ts
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  fetchFestivalInfo,
  fetchFestivalList,
  fetchFestivalPeriod,
  fetchFestivalSearch,
  GetFestivalListParams,
} from "../apis/festival";
import type { FestivalListItem } from "../types/festival";

// 무한 스크롤용 리스트
export function useInfiniteFestivalList(params: GetFestivalListParams = {}) {
  return useInfiniteQuery<{ item: FestivalListItem[]; totalCount: number }>({
    queryKey: ["festivalsInfinite", params],
    queryFn: ({ pageParam = 1 }) => fetchFestivalList({ ...params, pageNo: pageParam as number }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.item.length === 8 ? allPages.length + 1 : undefined, // 16: numOfRows
    initialPageParam: 1,
    staleTime: 1000 * 60,
  });
}

// 무한 스크롤용 검색
export function useInfiniteFestivalSearch(keyword: string, lang = "kor") {
  return useInfiniteQuery<{ item: FestivalListItem[]; totalCount: number }>({
    queryKey: ["festivalSearchInfinite", keyword, lang],
    queryFn: ({ pageParam = 1 }) => fetchFestivalSearch(keyword, lang, pageParam as number),
    enabled: !!keyword,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.item.length === 8 ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    staleTime: 1000 * 60,
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
