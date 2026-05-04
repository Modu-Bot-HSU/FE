import { useMutation } from "@tanstack/react-query";
import {
  buildPersonalSignPayload,
  extractAccessToken,
  login,
  normalizeWalletAddress,
  sendEmailVerificationCode,
  signup,
  type LoginResponse,
  type SignUpRequest,
  verifyEmailCode,
} from "../../../apis/auth/auth";
import { getErrorMessage } from "./signUpHelpers";

type Setters = {
  setRemainingSeconds: (n: number | ((p: number) => number)) => void;
  setIsEmailVerified: (v: boolean) => void;
  setIsSignUpCompleted: (v: boolean) => void;
  setSignupWalletAddress: (w: string) => void;
  setSuccessProfile: (p: { email: string; wallet: string } | null) => void;
};

export const useSignUpMutations = (s: Setters) => {
  const sendCodeMutation = useMutation({
    mutationFn: (requestEmail: string) =>
      sendEmailVerificationCode({ email: requestEmail }),
    onSuccess: (data) => {
      s.setRemainingSeconds(300);
      s.setIsEmailVerified(false);
      alert(data.message);
    },
    onError: (error: unknown) => {
      alert(`인증번호 전송 실패: ${getErrorMessage(error)}`);
    },
  });

  const verifyCodeMutation = useMutation({
    mutationFn: (payload: { email: string; code: string }) => verifyEmailCode(payload),
    onSuccess: (data) => {
      s.setIsEmailVerified(true);
      s.setRemainingSeconds(0);
      alert(data.message);
    },
    onError: (error: unknown) => {
      alert(`인증번호 확인 실패: ${getErrorMessage(error)}`);
    },
  });

  const signupMutation = useMutation<LoginResponse, unknown, SignUpRequest>({
    mutationFn: async (data: SignUpRequest) => {
      if (!window.ethereum) throw new Error("메타마스크 설치가 필요합니다.");
      const walletRaw = data.walletAddress.trim();
      const emailNorm = data.email.trim().toLowerCase();
      const { nonce } = await signup({
        name: data.name.trim(),
        email: emailNorm,
        walletAddress: walletRaw,
      });
      const message = buildPersonalSignPayload(nonce);
      const signature = (await window.ethereum.request({
        method: "personal_sign",
        params: [message, walletRaw],
      })) as string;
      return login({
        walletAddress: normalizeWalletAddress(walletRaw),
        signature,
      });
    },
    onSuccess: (data, variables) => {
      const token = extractAccessToken(data);
      if (token) localStorage.setItem("accessToken", token);
      s.setIsSignUpCompleted(true);
      s.setSignupWalletAddress(normalizeWalletAddress(variables.walletAddress));
      s.setSuccessProfile({
        email: variables.email.trim().toLowerCase(),
        wallet: normalizeWalletAddress(variables.walletAddress),
      });
      alert("회원가입이 완료되었습니다.");
    },
    onError: (error: unknown) => {
      alert(`회원가입 실패: ${getErrorMessage(error)}`);
    },
  });

  return { sendCodeMutation, verifyCodeMutation, signupMutation };
};
