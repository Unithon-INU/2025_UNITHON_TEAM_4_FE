import { getApiUrl } from "./client";
import client from "./client"; // axios 인스턴스 import

export interface CreatePostRequest {
  title: string;
  content: string;
  images: File[];
}

export interface CreatePostResponse {
  status: number;
  message: string;
  data: unknown;
}

export const createPost = async (data: CreatePostRequest): Promise<CreatePostResponse> => {
  const formData = new FormData();

  // 1. JSON 데이터 Blob으로 추가
  formData.append(
    "data",
    new Blob(
      [
        JSON.stringify({
          title: data.title.trim(),
          content: data.content.trim(),
        }),
      ],
      { type: "application/json" }
    )
  );

  // 2. 파일 업로드 검증
  if (data.images.length === 0) {
    throw new Error("최소 1개 이상의 이미지를 업로드해주세요");
  }

  // 3. 이미지 파일 첨부
  data.images.forEach((image) => {
    formData.append("images", image, image.name);
  });

  try {
    const response = await client.post(getApiUrl("/posts"), formData, {});
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("게시물 작성에 실패했습니다");
  }
};
