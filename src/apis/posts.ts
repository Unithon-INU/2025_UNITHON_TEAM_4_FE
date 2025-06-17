// apis/posts.ts
import client, { getApiUrl } from "./client";

export interface Writer {
  id: number;
  name: string;
  profileImage: string;
}

export interface Post {
  postId: number;
  likes: number;
  title: string;
  thumbnailUrl: string;
  writer: Writer;
  createdAt: string;
  updatedAt: string;
}

export interface PostsPaginatedResponse {
  status: number;
  message: string;
  data: {
    content: Post[];
    totalPages: number;
    totalElements: number;
    last: boolean;
    number: number; // 현재 페이지
    size: number; // 페이지 크기
    first: boolean;
    empty: boolean;
    // ...기타 필요한 필드
  };
}

/**
 * 전체 게시글을 페이지네이션 방식으로 조회
 * @param page 불러올 페이지(0부터 시작)
 * @param size 한 페이지 당 게시글 수
 * @returns 게시글 목록 및 페이지네이션 정보
 */
export const getPosts = async (
  page: number = 0,
  size: number = 6
): Promise<PostsPaginatedResponse> => {
  // 쿼리 파라미터로 전달 (size, page 기본값 있음)
  const response = await client.get(
    getApiUrl(`/posts?page=${page}&size=${size}`)
  );
  return response.data;
};
