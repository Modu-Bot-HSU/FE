import { API_BASE_URL, getBearerAuthHeaders, parseApiResponse } from "../httpClient";

export interface SignUpRequest {
  walletAddress: string;
  name: string;
  email: string;
}

export interface EmailVerificationRequest {
  email: string;
}

export interface EmailCodeVerificationRequest {
  email: string;
  code: string;
}

export interface MessageResponse {
  message: string;
}

/** POST /auth/signup/request — nonce only until /auth/signin/verify */
export interface SignUpNonceResponse {
  nonce: string;
}

/** @deprecated use SignUpNonceResponse; verify returns login shape */
export interface SignUpResponse {
  nonce?: number | string;
  accessToken?: string;
}

export interface NonceRequest {
  walletAddress: string;
}

export interface NonceResponse {
  nonce: number | string;
}

export interface LoginRequest {
  walletAddress: string;
  signature: string;
}

export interface LoginResponse {
  accessToken?: string;
  token?: string;
  jwt?: string;
  [key: string]: unknown;
}

export interface RefreshResponse {
  accessToken?: string;
  token?: string;
  jwt?: string;
  [key: string]: unknown;
}

export const normalizeWalletAddress = (walletAddress: string) =>
  walletAddress.trim().toLowerCase();

const toHex = (value: string) =>
  `0x${Array.from(value)
    .map((char) => char.charCodeAt(0).toString(16))
    .join("")}`;

export const buildPersonalSignPayload = (nonce: string | number) =>
  toHex(String(nonce));

export const extractAccessToken = (
  response: LoginResponse | SignUpResponse,
): string | null => {
  const payload = response as Record<string, unknown>;
  const token = payload.accessToken ?? payload.token ?? payload.jwt;
  return typeof token === "string" && token.length > 0 ? token : null;
};

const postWithFetch = async <TRequest, TResponse>(
  path: string,
  payload: TRequest,
  useAuth = false,
): Promise<TResponse> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(useAuth ? getBearerAuthHeaders() : {}),
    },
    body: JSON.stringify(payload),
  });

  return parseApiResponse<TResponse>(response);
};

// --- API 함수들 ---

// 회원가입 요청 (nonce 발급) → 서명 후 login(/auth/signin/verify) 호출
export const signup = async (signUpData: SignUpRequest): Promise<SignUpNonceResponse> => {
  const payload: SignUpRequest = {
    name: signUpData.name.trim(),
    email: signUpData.email.trim().toLowerCase(),
    walletAddress: normalizeWalletAddress(signUpData.walletAddress),
  };
  return postWithFetch<SignUpRequest, SignUpNonceResponse>("/auth/signup/request", payload);
};

// 이메일 인증 코드 발송
export const sendEmailVerificationCode = async (
  requestData: EmailVerificationRequest,
): Promise<MessageResponse> => {
  return postWithFetch<EmailVerificationRequest, MessageResponse>(
    "/mail/send",
    requestData,
    true,
  );
};

// 이메일 인증 코드 확인
export const verifyEmailCode = async (
  requestData: EmailCodeVerificationRequest,
): Promise<MessageResponse> => {
  return postWithFetch<EmailCodeVerificationRequest, MessageResponse>(
    "/mail/verify",
    requestData,
    true,
  );
};

// 논스값 받아오기
export const getNonce = async (
  nonceData: NonceRequest,
): Promise<NonceResponse> => {
  return postWithFetch<NonceRequest, NonceResponse>("/auth/signin/request", {
    walletAddress: normalizeWalletAddress(nonceData.walletAddress),
  });
};

// 로그인 - 서명값으로 시도
export const login = async (
  loginData: LoginRequest,
): Promise<LoginResponse> => {
  return postWithFetch<LoginRequest, LoginResponse>("/auth/signin/verify", {
    ...loginData,
    walletAddress: normalizeWalletAddress(loginData.walletAddress),
  });
};

export const refreshAccessToken = async (): Promise<RefreshResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "GET",
    headers: {
      ...getBearerAuthHeaders(),
    },
  });

  return parseApiResponse<RefreshResponse>(response);
};
