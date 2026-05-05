import { axiosInstance } from "../axios";

export interface NftGoodsItem {
  index: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  metadataUrl: string;
  isSold: boolean;
  txHash: string | null;
  owner: string | null;
}

export interface PurchaseNftRequest {
  index: number;
}

export interface RewardRequest {
  to: string;
  amount: string;
}

export interface HsBalanceResponse {
  address: string;
  balance: string;
  symbol: string;
}

export type ApiObjectResponse = Record<string, unknown>;

const createAuthConfig = (accessToken?: string) => {
  const token = accessToken?.trim();
  if (!token) return undefined;

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getNftGoods = async (accessToken?: string): Promise<NftGoodsItem[]> => {
  const { data } = await axiosInstance.get<NftGoodsItem[]>(
    "/blockchain/nft/goods",
    createAuthConfig(accessToken),
  );
  return data;
};

export const purchaseNft = async (
  payload: PurchaseNftRequest,
  accessToken?: string,
): Promise<ApiObjectResponse> => {
  const { data } = await axiosInstance.post<ApiObjectResponse>(
    "/blockchain/nft/purchase",
    payload,
    createAuthConfig(accessToken),
  );
  return data;
};

export const rewardToken = async (
  payload: RewardRequest,
  accessToken?: string,
): Promise<ApiObjectResponse> => {
  const { data } = await axiosInstance.post<ApiObjectResponse>(
    "/blockchain/reward",
    payload,
    createAuthConfig(accessToken),
  );
  return data;
};

export const getHsBalance = async (
  accessToken?: string,
): Promise<HsBalanceResponse> => {
  const { data } = await axiosInstance.get<HsBalanceResponse>(
    "/blockchain/balance",
    createAuthConfig(accessToken),
  );
  return data;
};
