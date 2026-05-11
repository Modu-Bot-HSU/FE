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

const MOCK_NFT_GOODS: NftGoodsItem[] = [
  {
    index: 0,
    name: "공학관",
    description: "한성대학교 공학관 3D NFT",
    price: "120",
    imageUrl: "/models/gonghak.glb",
    metadataUrl: "ipfs://mock/0",
    isSold: false,
    txHash: null,
    owner: null,
  },
  {
    index: 1,
    name: "지선관",
    description: "한성대학교 지선관 3D NFT",
    price: "20",
    imageUrl: "/models/jiseon.glb",
    metadataUrl: "ipfs://mock/1",
    isSold: true,
    txHash: "0xabcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234",
    owner: "0xABCD...1234",
  },
  {
    index: 2,
    name: "낙산관",
    description: "한성대학교 낙산관 3D NFT",
    price: "20",
    imageUrl: "/models/naksan.glb",
    metadataUrl: "ipfs://mock/2",
    isSold: false,
    txHash: null,
    owner: null,
  },
  {
    index: 3,
    name: "우촌관",
    description: "한성대학교 우촌관 3D NFT",
    price: "20",
    imageUrl: "/models/wuchon.glb",
    metadataUrl: "ipfs://mock/3",
    isSold: false,
    txHash: null,
    owner: null,
  },
  {
    index: 4,
    name: "연구관",
    description: "한성대학교 연구관 3D NFT",
    price: "20",
    imageUrl: "/models/yeongu.glb",
    metadataUrl: "ipfs://mock/4",
    isSold: false,
    txHash: null,
    owner: null,
  },
];

const USE_MOCK = true;

export const getNftGoods = async (accessToken?: string): Promise<NftGoodsItem[]> => {
  if (USE_MOCK) {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_NFT_GOODS), 300));
  }
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
  if (USE_MOCK) {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ address: "0xMock", balance: "100", symbol: "HS" }), 300),
    );
  }
  const { data } = await axiosInstance.get<HsBalanceResponse>(
    "/blockchain/balance",
    createAuthConfig(accessToken),
  );
  return data;
};
