import client, { getApiUrl } from "./client";

export interface Post {
  postId: number;
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
  const response = await client.get<UserProfileResponse>(getApiUrl("/users"));
  return response.data;
};

// 계정 설정 페이지용 계정 정보 조회/수정
export interface User {
  name: string; // 이름만 사용
  profileImageUrl: string;
}

export interface UserResponse {
  status: number;
  message: string;
  data: User;
}

export interface UpdateUserRequest {
  name?: string;
}

// 계정 정보 조회
export const fetchUser = async (): Promise<UserResponse> => {
  const response = await client.get<UserResponse>(getApiUrl("/users"));
  return response.data;
};

// 계정 정보 수정 (이름만)
export const updateUser = async (data: UpdateUserRequest): Promise<UserResponse> => {
  const response = await client.patch<UserResponse>(getApiUrl("/users"), data);
  return response.data;
};

// 프로필 이미지 변경
export const updateProfileImage = async (
  image: File
): Promise<{ status: number; message: string }> => {
  const formData = new FormData();
  formData.append("image", image);
  const response = await client.post(getApiUrl("/users/profile-image"), formData);
  return response.data;
};

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

// 비밀번호 변경 API
export const changePassword = async (
  data: ChangePasswordRequest
): Promise<{ status: number; message: string }> => {
  const response = await client.patch(getApiUrl("/users/password"), data);
  return response.data;
};
