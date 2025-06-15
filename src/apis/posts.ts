import client, { getApiUrl } from "./client";

export interface Post {
  postId: number;
  likes: number;
  title: string;
  thumbnailUrl: string;
  writer: {
    id: number;
    name: string;
    profileImage: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PostsResponse {
  status: number;
  message: string;
  data: Post[];
}

export const getPosts = async (): Promise<PostsResponse> => {
  const response = await client.get(getApiUrl("/posts"));
  return response.data;
};
