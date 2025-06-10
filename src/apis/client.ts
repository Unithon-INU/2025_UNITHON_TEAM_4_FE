import axios, { InternalAxiosRequestConfig } from "axios";

// 실제 백엔드 서버 주소 (포트 포함! 실제 서버에 맞게 수정)
const BACKEND_BASE_URL = "http://15.164.50.164:8080/api/v1";

// 환경에 따라 프록시 경로 다르게 만드는 함수
const getApiUrl = (endpoint: string) => {
  // 축제 API라면 v1을 제거
  const isFestivalApi = endpoint.startsWith("/festivals");
  const base = isFestivalApi
    ? BACKEND_BASE_URL.replace(/\/v1$/, "") // v1 제거
    : BACKEND_BASE_URL;
  // Vercel(prod) 환경이면 프록시 사용
  if (import.meta.env.MODE === "production") {
    const target = `${base}${endpoint}`;
    return `/api/proxy?url=${encodeURIComponent(target)}`;
  }
  // 개발환경은 Vite 프록시로 직접 접근
  return `${base}${endpoint}`;
};

const client = axios.create({
  // baseURL 사용 안 함!
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 (토큰 자동 부착)
client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.withCredentials = true;
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (401/리프레시 토큰 등)
// 응답 인터셉터 (401/리프레시 토큰 등)
client.interceptors.response.use(
  (res) => {
    if (res.data.refreshed) {
      const new_Token = res.headers["authorization"];
      localStorage.setItem("accessToken", new_Token);
    }
    return res;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.replace("/"); // 401 뜨면 메인페이지로 이동
    }
    return Promise.reject(error);
  }
);

// 내보낼 때, getApiUrl 함수도 함께 export!
export { getApiUrl };

export default client;
