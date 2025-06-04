import axios, { InternalAxiosRequestConfig } from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_UNITHON_SERVER_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

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

export default client;
