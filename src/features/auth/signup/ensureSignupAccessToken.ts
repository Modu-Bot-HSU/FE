import {
  buildPersonalSignPayload,
  extractAccessToken,
  getNonce,
  login,
  normalizeWalletAddress,
  type LoginRequest,
  type NonceResponse,
} from "../../../apis/auth/auth";

type Options = {
  forceRefresh: boolean;
  signupWalletAddress: string;
};

export async function ensureSignupAccessToken({
  forceRefresh,
  signupWalletAddress,
}: Options): Promise<boolean> {
  const existingToken = localStorage.getItem("accessToken");
  if (existingToken && !forceRefresh) {
    return true;
  }

  if (!window.ethereum) {
    alert("메타마스크 설치가 필요합니다.");
    return false;
  }

  const accounts = (await window.ethereum.request({
    method: "eth_requestAccounts",
  })) as string[];
  const activeAccountRaw = (accounts[0] ?? "").trim();
  const activeAccount = normalizeWalletAddress(activeAccountRaw);
  if (!activeAccountRaw) {
    alert("메타마스크 계정을 찾을 수 없습니다.");
    return false;
  }

  if (
    signupWalletAddress &&
    normalizeWalletAddress(signupWalletAddress) !== activeAccount
  ) {
    alert(
      "인증 메일 전송 전 로그인이 필요합니다. 회원가입에 입력한 지갑 주소와 메타마스크에서 선택한 계정이 같아야 합니다. 메타마스크에서 해당 계정으로 바꾸거나, 가입 폼의 지갑 주소를 현재 계정 주소로 맞춰주세요.",
    );
    return false;
  }

  const nonceResponse = (await getNonce({
    walletAddress: activeAccount,
  })) as NonceResponse;
  const { nonce } = nonceResponse;

  const signature = await window.ethereum.request({
    method: "personal_sign",
    params: [buildPersonalSignPayload(nonce), activeAccountRaw],
  });

  const loginPayload: LoginRequest = {
    walletAddress: activeAccount,
    signature: signature as string,
  };
  const loginResponse = await login(loginPayload);
  const loginAccessToken = extractAccessToken(loginResponse);

  if (!loginAccessToken) {
    alert("로그인 토큰이 발급되지 않았습니다.");
    return false;
  }

  localStorage.setItem("accessToken", loginAccessToken);
  return true;
}
