import client, { getApiUrl } from "./client";

export interface Comment {
  commentId: number;
  content: string;
  writerId: number;
  writerName: string;
  writerProfileImageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Image {
  imageUrl: string;
}

export interface Writer {
  id: number;
  name: string;
  profileImage: string;
}

export interface PostDetail {
  postId: number;
  likes: number;
  title: string;
  content: string;
  thumbnailUrl: string;
  images: Image[];
  comments: Comment[];
  writer: Writer;
  createdAt: string;
  updatedAt: string;
}

export interface PostDetailResponse {
  status: number;
  message: string;
  data: PostDetail;
}
export interface CreateCommentRequest {
  postId: number;
  content: string;
}

export interface BaseResponse {
  status: number;
  message: string;
  data: unknown;
}

export interface DeletePostResponse {
  status: number;
  message: string;
  data: unknown;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  images?: File[];
  removedImageUrls?: string[];
}

export const createComment = async (postId: number, content: string): Promise<BaseResponse> => {
  const response = await client.post(getApiUrl(`/posts/${postId}/comments`), {
    postId,
    content,
  });
  return response.data;
};

export const getPost = async (postId: number): Promise<PostDetailResponse> => {
  const response = await client.get(getApiUrl(`/posts/${postId}`));
  return response.data;
};

export const deletePost = async (postId: number): Promise<DeletePostResponse> => {
  const response = await client.delete(getApiUrl(`/posts/${postId}`));
  return response.data;
};

export const updatePost = async (
  postId: number,
  data: UpdatePostRequest
): Promise<BaseResponse> => {
  const formData = new FormData();

  // 1. JSON 데이터 Blob으로 추가
  formData.append(
    "data",
    new Blob(
      [
        JSON.stringify({
          title: data.title?.trim(),
          content: data.content?.trim(),
          removedImageUrls: data.removedImageUrls,
        }),
      ],
      { type: "application/json" }
    )
  );

  // 2. 이미지 파일 첨부 (있을 경우만)
  if (data.images && data.images.length > 0) {
    data.images.forEach((image) => {
      formData.append("images", image, image.name);
    });
  }

  // 3. PATCH 요청
  try {
    const response = await client.patch(getApiUrl(`/posts/${postId}`), formData);
    return response.data;
  } catch (error) {
    console.error("게시물 수정 실패:", error);
    throw error;
  }
};
