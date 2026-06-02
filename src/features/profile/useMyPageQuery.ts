import { useQuery } from "@tanstack/react-query";
import { getMyPage } from "../../apis/blockchain/blockchain";

const isServerError = (error: unknown) => {
  const status = (error as { response?: { status?: number } })?.response?.status;
  return typeof status === "number" && status >= 500;
};

export const myPageQueryKey = (accessToken?: string) => ["my-page", accessToken] as const;

export const useMyPageQuery = (accessToken?: string) => {
  return useQuery({
    queryKey: myPageQueryKey(accessToken),
    queryFn: () => getMyPage(accessToken),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: (failureCount, error) => {
      if (isServerError(error)) return false;
      return failureCount < 1;
    },
  });
};