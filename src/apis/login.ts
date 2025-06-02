import client from "./client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  data: string; // 서버응답 토큰
}

// 로그인 API 함수
const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await client.post<LoginResponse>("auth/login", data);
  const token = response.data.data;
  //   const id = response.data.id;

  // 토큰을 로컬 스토리지에 저장
  localStorage.setItem("token", token);
  //   localStorage.setItem("userId", id.toString());
  return response.data;
};

export default login;
