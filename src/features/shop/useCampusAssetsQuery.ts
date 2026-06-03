import { useQuery } from "@tanstack/react-query";
import { getHsBalance, getNftGoods, type NftGoodsItem } from "../../apis/blockchain/blockchain";

type CampusAssets = {
  goods: NftGoodsItem[];
  balance: string;
};

const DEFAULT_CAMPUS_ASSETS: CampusAssets = {
  goods: [],
  balance: "0",
};

const isServerError = (error: unknown) => {
  const status = (error as { response?: { status?: number } })?.response?.status;
  return typeof status === "number" && status >= 500;
};

export const campusAssetsQueryKey = (accessToken?: string) =>
  ["campus-assets", accessToken] as const;

export const useCampusAssetsQuery = (accessToken?: string) => {
  return useQuery({
    queryKey: campusAssetsQueryKey(accessToken),
    queryFn: async (): Promise<CampusAssets> => {
      const [goodsResult, balanceResult] = await Promise.allSettled([
        getNftGoods(accessToken),
        getHsBalance(accessToken),
      ]);

      if (goodsResult.status === "rejected" && balanceResult.status === "rejected") {
        throw goodsResult.reason ?? balanceResult.reason ?? new Error("자산 정보를 불러오지 못했습니다.");
      }

      return {
        goods:
          goodsResult.status === "fulfilled" && Array.isArray(goodsResult.value)
            ? goodsResult.value
            : DEFAULT_CAMPUS_ASSETS.goods,
        balance:
          balanceResult.status === "fulfilled"
            ? balanceResult.value.balance
            : DEFAULT_CAMPUS_ASSETS.balance,
      };
    },
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: (failureCount, error) => {
      if (isServerError(error)) return false;
      return failureCount < 1;
    },
  });
};