import type { UseMutationResult } from "@tanstack/react-query";
import { normalizeWalletAddress } from "../../../apis/auth/auth";
import { getErrorMessage } from "./signUpHelpers";
import { ethereumRequest } from "../wallet/ethereumProvider";

type CompleteMut = UseMutationResult<
  unknown,
  unknown,
  { email: string; walletAddress: string },
  unknown
>;

export type SignUpCompleteProfile = { email: string; wallet: string };

export async function runSignUpComplete(
  email: string,
  walletAddress: string,
  setWalletAddress: (w: string) => void,
  completeSignupMutation: CompleteMut,
): Promise<boolean> {
  const trimmedWalletAddress = walletAddress.trim();

  if (!trimmedWalletAddress) {
    alert("지갑 주소를 입력해주세요.");
    return false;
  }

  if (
    !/^0x/i.test(trimmedWalletAddress) ||
    trimmedWalletAddress.length !== 42
  ) {
    alert("올바른 지갑 주소를 입력해주세요.");
    return false;
  }

  let accounts: string[];
  try {
    accounts = await ethereumRequest<string[]>("eth_requestAccounts");
  } catch (error: unknown) {
    alert(getErrorMessage(error));
    return false;
  }

  const activeAccountRaw = (accounts[0] ?? "").trim();
  if (!activeAccountRaw) {
    alert("메타마스크 계정을 선택해주세요.");
    return false;
  }

  if (
    normalizeWalletAddress(trimmedWalletAddress) !==
    normalizeWalletAddress(activeAccountRaw)
  ) {
    alert(
      "입력한 지갑 주소와 메타마스크에서 선택한 계정이 다릅니다. 주소를 맞추거나 메타마스크 계정을 바꿔주세요.",
    );
    return false;
  }

  setWalletAddress(activeAccountRaw);

  await completeSignupMutation.mutateAsync({
    email,
    walletAddress: activeAccountRaw,
  });
  return true;
}

export async function runConnectMetaMask(
  setWalletAddress: (w: string) => void,
): Promise<void> {
  try {
    const accounts = await ethereumRequest<string[]>("eth_requestAccounts");
    const raw = (accounts[0] ?? "").trim();
    if (!raw) {
      alert("메타마스크 계정을 찾을 수 없습니다.");
      return;
    }
    setWalletAddress(raw);
  } catch (error: unknown) {
    alert(getErrorMessage(error));
  }
}
