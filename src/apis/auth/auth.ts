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

export interface SignUpResponse {
  nonce?: number | string;
  accessToken?: string;
  refreshToken?: string;
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
  refreshToken?: string;
  token?: string;
  jwt?: string;
  [key: string]: unknown;
}

export interface RefreshResponse {
  accessToken?: string;
  refreshToken?: string;
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

export const extractRefreshToken = (
  response: LoginResponse | SignUpResponse | RefreshResponse,
): string | null => {
  const payload = response as Record<string, unknown>;
  const token = payload.refreshToken;
  return typeof token === "string" && token.length > 0 ? token : null;
};

export const saveAuthTokens = (
  response: LoginResponse | SignUpResponse | RefreshResponse,
) => {
  const accessToken = extractAccessToken(response);
  const refreshToken = extractRefreshToken(response);

  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
  }

  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }
};

export const clearAuthTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

const BASE_URL = "https://modubot.shop";

const parseResponse = async <TResponse>(response: Response): Promise<TResponse> => {
  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    if (typeof body === "object" && body !== null && "message" in body) {
      const raw = (body as { message?: unknown }).message;
      if (typeof raw === "string") {
        message = raw;
      } else if (Array.isArray(raw) && raw.every((item) => typeof item === "string")) {
        message = (raw as string[]).join(", ");
      }
    }
    throw new Error(message);
  }

  return body as TResponse;
};

const getAuthHeaders = (tokenKey: "accessToken" | "refreshToken" = "accessToken") => {
  const token = localStorage.getItem(tokenKey);
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const postWithFetch = async <TRequest, TResponse>(
  path: string,
  payload: TRequest,
  useAuth = false,
): Promise<TResponse> => {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(useAuth ? getAuthHeaders() : {}),
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<TResponse>(response);
};

// --- API 함수들 ---

// 회원가입 요청
export const signup = async (signUpData: SignUpRequest) => {
  const payload: SignUpRequest = {
    ...signUpData,
    walletAddress: normalizeWalletAddress(signUpData.walletAddress),
  };
  return postWithFetch<SignUpRequest, SignUpResponse>("/auth/signup/request", payload);
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
  const response = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "GET",
    headers: {
      ...getAuthHeaders("refreshToken"),
    },
  });

  return parseResponse<RefreshResponse>(response);
};
