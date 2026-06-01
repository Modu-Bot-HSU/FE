import type { UseMutationResult } from "@tanstack/react-query";
import { normalizeWalletAddress } from "../../../apis/auth/auth";
import { getErrorMessage } from "./signUpHelpers";

type CompleteMut = UseMutationResult<
  unknown,
  unknown,
  { email: string; walletAddress: string },
  unknown
>;

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

  if (!/^0x/i.test(trimmedWalletAddress) || trimmedWalletAddress.length !== 42) {
    alert("올바른 지갑 주소를 입력해주세요.");
    return false;
  }

  if (!window.ethereum) {
    alert("회원가입 전 메타마스크 연결이 필요합니다.");
    return false;
  }

  let accounts: string[];
  try {
    accounts = (await window.ethereum.request({
      method: "eth_requestAccounts",
    })) as string[];
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
    normalizeWalletAddress(trimmedWalletAddress) !== normalizeWalletAddress(activeAccountRaw)
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

export async function runConnectMetaMask(setWalletAddress: (w: string) => void): Promise<void> {
  try {
    if (!window.ethereum) {
      alert("메타마스크 설치가 필요합니다.");
      return;
    }
    const accounts = (await window.ethereum.request({
      method: "eth_requestAccounts",
    })) as string[];
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
