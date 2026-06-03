import { useMutation } from "@tanstack/react-query";
import {
  buildPersonalSignPayload,
  extractAccessToken,
  extractRefreshToken,
  login,
  normalizeWalletAddress,
  signupRequest,
  signupVerify,
  signupWallet,
  type LoginResponse,
  type SignUpRequest,
} from "../../../apis/auth/auth";
import { getErrorMessage } from "./signUpHelpers";
import { ethereumRequest } from "../wallet/ethereumProvider";

export const SIGNUP_WALLET_SESSION_SECONDS = 600;

type Setters = {
  setRemainingSeconds: (n: number | ((p: number) => number)) => void;
  setWalletSessionSeconds: (n: number | ((p: number) => number)) => void;
  setIsEmailVerified: (v: boolean) => void;
  setIsSignUpCompleted: (v: boolean) => void;
  setSuccessProfile: (p: { email: string; wallet: string } | null) => void;
};

type VerifyPayload = {
  email: string;
  code: string;
};

type CompletePayload = {
  email: string;
  walletAddress: string;
};

export const useSignUpMutations = (s: Setters) => {
  const sendCodeMutation = useMutation({
    mutationFn: (payload: SignUpRequest) => signupRequest(payload),
    onSuccess: (data) => {
      s.setRemainingSeconds(300);
      s.setIsEmailVerified(false);
      s.setWalletSessionSeconds(0);
      alert(data.message);
    },
    onError: (error: unknown) => {
      alert(`인증번호 전송 실패: ${getErrorMessage(error)}`);
    },
  });

  const verifyCodeMutation = useMutation({
    mutationFn: (payload: VerifyPayload) =>
      signupVerify({
        email: payload.email.trim().toLowerCase(),
        code: payload.code.trim(),
      }),
    onSuccess: (data) => {
      s.setIsEmailVerified(true);
      s.setRemainingSeconds(0);
      s.setWalletSessionSeconds(SIGNUP_WALLET_SESSION_SECONDS);
      alert(data.message);
    },
    onError: (error: unknown) => {
      alert(`인증번호 확인 실패: ${getErrorMessage(error)}`);
    },
  });

  const completeSignupMutation = useMutation<LoginResponse, unknown, CompletePayload>({
    /* Step 3 */
    mutationFn: async ({ email, walletAddress }) => {
      const walletRaw = walletAddress.trim();
      const { nonce } = await signupWallet({
        email: email.trim().toLowerCase(),
        walletAddress: walletRaw,
      });

      const message = buildPersonalSignPayload(nonce);
      const signature = await ethereumRequest<string>("personal_sign", [message, walletRaw]);

      return login({
        walletAddress: normalizeWalletAddress(walletRaw),
        signature,
      });
    },
    onSuccess: (data, variables) => {
      const token = extractAccessToken(data);
      const refreshToken = extractRefreshToken(data);
      if (token) localStorage.setItem("accessToken", token);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

      s.setIsSignUpCompleted(true);
      s.setWalletSessionSeconds(0);
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

  return { sendCodeMutation, verifyCodeMutation, completeSignupMutation };
};
