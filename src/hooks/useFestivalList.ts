import { useLangStore } from "../libraries/stores/langStore";
import {
  fetchFestivalInfo,
  fetchFestivalList,
  fetchFestivalPeriod,
  fetchFestivalSearch,
  fetchFestivalDetailInfo,
  fetchLocationFood,
  GetFestivalListParams,
  GetLocationFoodParams,
} from "../apis/festival";
import type { FestivalListItem, FestivalDetailInfoItem, LocationFoodItem } from "../types/festival";
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

// 무한 스크롤용 리스트
export function useInfiniteFestivalList(params: GetFestivalListParams = {}) {
  const lang = useLangStore((state) => state.lang);
  return useInfiniteQuery<{ item: FestivalListItem[]; totalCount: number }>({
    queryKey: ["festivalsInfinite", { ...params, lang }],
    queryFn: ({ pageParam = 1 }) => fetchFestivalList({ ...params, lang, pageNo: pageParam as number }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.item.length === 8 ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    staleTime: 1000 * 60,
  });
}

// 무한 스크롤용 검색
export function useInfiniteFestivalSearch(keyword: string) {
  const lang = useLangStore((state) => state.lang);
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

// 소개(overview)/info
export function useFestivalOverview(contentId?: string) {
  const lang = useLangStore((state) => state.lang);
  return useQuery({
    queryKey: ["festivalOverview", contentId, lang],
    queryFn: () => fetchFestivalInfo(contentId!, lang),
    enabled: !!contentId,
    staleTime: 1000 * 60,
  });
}

// 기간(시작,종료일)/detailIntro
export function useFestivalPeriod(contentId?: string, contentTypeId?: string) {
  const lang = useLangStore((state) => state.lang);
  return useQuery({
    queryKey: ["festivalPeriod", contentId, contentTypeId, lang],
    queryFn: () => fetchFestivalPeriod(contentId!, contentTypeId!, lang),
    enabled: !!contentId && !!contentTypeId,
    staleTime: 1000 * 60,
  });
}

// 상세정보/detailInfo
export function useFestivalDetailInfo(contentId?: string, contentTypeId?: string) {
  const lang = useLangStore((state) => state.lang);
  return useQuery<FestivalDetailInfoItem[]>({
    queryKey: ["festivalDetailInfo", contentId, contentTypeId, lang],
    queryFn: () => fetchFestivalDetailInfo(contentId!, contentTypeId!, lang),
    enabled: !!contentId && !!contentTypeId,
    staleTime: 1000 * 60,
  });
}

// 근처 먹거리 음식점 hook /api/festivals/locationFood
export function useLocationFood(params: GetLocationFoodParams, enabled = true) {
  const lang = useLangStore((state) => state.lang);
  return useQuery<LocationFoodItem[]>({
    queryKey: ["locationFood", { ...params, lang }],
    queryFn: () => fetchLocationFood({ ...params, lang }),
    enabled: !!params.mapx && !!params.mapy && enabled,
    staleTime: 1000 * 60,
  });
}
