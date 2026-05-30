import { axiosInstance } from "../axios";
import { BrowserProvider, Contract, parseUnits } from "ethers";

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

const HS_TOKEN_ADDRESS = import.meta.env.VITE_HS_TOKEN_ADDRESS;
const HS_NFT_ADDRESS = import.meta.env.VITE_HS_NFT_ADDRESS;
const POLYGON_AMOY_CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID ?? "80002");
const HS_TOKEN_DECIMALS = Number(import.meta.env.VITE_HS_TOKEN_DECIMALS ?? "18");

const HS_TOKEN_ABI = [
  "function approve(address spender, uint256 value) returns (bool)",
];

const toChainHex = (chainId: number) => `0x${chainId.toString(16)}`;

const POLYGON_AMOY_PARAMS = {
  chainId: toChainHex(POLYGON_AMOY_CHAIN_ID),
  chainName: "Polygon Amoy Testnet",
  nativeCurrency: {
    name: "POL",
    symbol: "POL",
    decimals: 18,
  },
  rpcUrls: ["https://rpc-amoy.polygon.technology"],
  blockExplorerUrls: ["https://amoy.polygonscan.com"],
};

const createAuthConfig = (accessToken?: string) => {
  const token = accessToken?.trim();
  if (!token) return undefined;

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const ensureNftPurchaseApproval = async (
  requiredAmount: string | number,
): Promise<void> => {
  if (!window.ethereum) {
    throw new Error("MetaMask를 설치해주세요.");
  }

  if (!HS_TOKEN_ADDRESS || !HS_NFT_ADDRESS) {
    throw new Error("환경변수(VITE_HS_TOKEN_ADDRESS, VITE_HS_NFT_ADDRESS)를 설정해주세요.");
  }

  await window.ethereum.request({ method: "eth_requestAccounts" });

  const currentChainHex = (await window.ethereum.request({ method: "eth_chainId" })) as string;
  if (Number.parseInt(currentChainHex, 16) !== POLYGON_AMOY_CHAIN_ID) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toChainHex(POLYGON_AMOY_CHAIN_ID) }],
      });
    } catch (error) {
      const code =
        typeof error === "object" && error !== null && "code" in error
          ? (error as { code?: number | string }).code
          : undefined;

      if (code === 4902 || code === "4902") {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [POLYGON_AMOY_PARAMS],
        });
      } else {
        throw error;
      }
    }
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const tokenContract = new Contract(HS_TOKEN_ADDRESS, HS_TOKEN_ABI, signer);
  const requiredAllowance = parseUnits(String(requiredAmount), HS_TOKEN_DECIMALS);
  const approveTx = await tokenContract.approve(HS_NFT_ADDRESS, requiredAllowance);
  await approveTx.wait();
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
    price: "30",
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
  {
    index: 5,
    name: "상상관",
    description: "한성대학교 상상관 3D NFT",
    price: "20",
    imageUrl: "/models/sangsang.glb",
    metadataUrl: "ipfs://mock/5",
    isSold: false,
    txHash: null,
    owner: null,
  },
  {
    index: 6,
    name: "진리관",
    description: "한성대학교 진리관 3D NFT",
    price: "20",
    imageUrl: "/models/jinri.glb",
    metadataUrl: "ipfs://mock/6",
    isSold: false,
    txHash: null,
    owner: null,
  },
  {
    index: 7,
    name: "학송관",
    description: "한성대학교 학송관 3D NFT",
    price: "20",
    imageUrl: "/models/haksong.glb",
    metadataUrl: "ipfs://mock/7",
    isSold: false,
    txHash: null,
    owner: null,
  },
  {
    index: 8,
    name: "창의관",
    description: "한성대학교 창의관 3D NFT",
    price: "20",
    imageUrl: "/models/changui.glb",
    metadataUrl: "ipfs://mock/8",
    isSold: false,
    txHash: null,
    owner: null,
  },
  {
    index: 9,
    name: "미래관",
    description: "한성대학교 미래관 3D NFT",
    price: "20",
    imageUrl: "/models/mirae.glb",
    metadataUrl: "ipfs://mock/9",
    isSold: false,
    txHash: null,
    owner: null,
  },
  {
    index: 10,
    name: "탐구관",
    description: "한성대학교 탐구관 3D NFT",
    price: "20",
    imageUrl: "/models/tamgu.glb",
    metadataUrl: "ipfs://mock/10",
    isSold: false,
    txHash: null,
    owner: null,
  },
];

const USE_MOCK = false;

export interface MyPageNftItem {
  index: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  metadataUrl: string;
  txHash: string;
}

export interface MyPageResponse {
  email: string;
  walletAddress: string;
  hsTokenBalance: string;
  nftCount: number;
  nfts: MyPageNftItem[];
}

export const getMyPage = async (accessToken?: string): Promise<MyPageResponse> => {
  const { data } = await axiosInstance.get<MyPageResponse>(
    "/users/mypage",
    createAuthConfig(accessToken),
  );
  return data;
};

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
