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
