import { authApi } from "./axiosInstance";

export interface HsTokenBalanceResponse {
  address: string;
  balance: string;
  symbol: string;
}

const USER_HS_TOKEN_PATH = "/user/hs-token";

export const fetchUserHsToken = async (): Promise<HsTokenBalanceResponse> => {
  const { data } = await authApi.get<HsTokenBalanceResponse>(USER_HS_TOKEN_PATH);
  return data;
};
