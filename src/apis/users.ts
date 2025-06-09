import client from "./client";

export interface Post {
  thumbnailUrl: string;
  title: string;
  updatedAt: string;
}

export interface UserProfileResponse {
  status: number;
  message: string;
  data: {
    name: string;
    profileImageUrl: string;
    email: string;
    createdAt: string;
    postCount: number;
    posts: Post[];
  };
}

export const fetchUserProfile = async (): Promise<UserProfileResponse> => {
  const response = await client.get<UserProfileResponse>("/users");
  return response.data;
};
