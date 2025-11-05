import axios, { InternalAxiosRequestConfig } from "axios";
import i18next from "i18next";

// 실제 백엔드 서버 주소 (예: http://3.36.58.159:8080/api/v1)
const BACKEND_BASE_URL = import.meta.env.VITE_UNITHON_SERVER_URL;

/**
 * BASE_URL의 마지막 버전 세그먼트(/v1)를 /v2 등으로 치환
 * - 기본은 v1 그대로
 * - BASE_URL 끝이 /v1 로 끝난다는 전제에 안전하게 동작
 */
const resolveBaseUrlByVersion = (version: "v1" | "v2" = "v1") => {
  const base = String(BACKEND_BASE_URL || "");
  if (version === "v1") return base;

  // 끝이 /v1로 끝나면 /v2로 치환
  // (/v1/, /v1 모두 대응)
  const replaced = base.replace(/\/v1\/?$/, "/v2");
  return replaced;
};

/**
 * 환경에 맞는 최종 요청 URL 생성
 * - 기본은 v1
 * - 필요한 경우 version에 "v2"를 넘겨서 /api/v2 로 전송
 */
const getApiUrl = (endpoint: string, version: "v1" | "v2" = "v1") => {
  const base = resolveBaseUrlByVersion(version);

  if (import.meta.env.MODE === "production") {
    const target = `${base}${endpoint}`;
    return `/api/proxy?url=${encodeURIComponent(target)}`;
  }

  // 개발환경은 Vite 프록시(또는 직접)로 접근
  return `${base}${endpoint}`;
};

const client = axios.create({
  // baseURL 사용 안 함!
  withCredentials: true,
  // headers: { "Content-Type": "application/json" },
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
client.interceptors.response.use(
  (res) => {
    if (res.data?.refreshed) {
      const new_Token = res.headers["authorization"];
      if (new_Token) {
        localStorage.setItem("accessToken", new_Token);
      }
    }
    return res;
  },
  (error) => {
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      window.location.pathname !== "/login"
    ) {
      alert(i18next.t("loginRequired")); // i18n 메시지로 alert
      localStorage.clear();
      window.location.replace("/login");
    }
    return Promise.reject(error);
  }
);

// 필요 시 v2 전용 헬퍼도 함께 export (선택사항)
const getApiUrlV2 = (endpoint: string) => getApiUrl(endpoint, "v2");

// 내보낼 때, getApiUrl 함수도 함께 export!
export { getApiUrl, getApiUrlV2 };
export default client;
