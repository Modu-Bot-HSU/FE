import axios from "axios";

const BASE_URL = "https://modubot.shop";

// 1. 회원가입, 로그인, 이메일 인증
export const publicApi = axios.create({
  baseURL: BASE_URL,
});

// 2. 인증이 필요한 API
export const authApi = axios.create({
  baseURL: BASE_URL,
});

// authApi에만 인터셉터 설정
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default publicApi;