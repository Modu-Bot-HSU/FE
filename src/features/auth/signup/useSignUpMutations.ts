import { useMutation } from "@tanstack/react-query";
import {
  normalizeWalletAddress,
  sendEmailVerificationCode,
  signup,
  type SignUpRequest,
  type SignUpResponse,
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

  const signupMutation = useMutation<SignUpResponse, unknown, SignUpRequest>({
    mutationFn: (data: SignUpRequest) => signup(data),
    onSuccess: (data, variables) => {
      localStorage.removeItem("accessToken");
      s.setIsSignUpCompleted(true);
      s.setSignupWalletAddress(normalizeWalletAddress(variables.walletAddress));
      s.setSuccessProfile({
        email: variables.email,
        wallet: normalizeWalletAddress(variables.walletAddress),
      });
      alert("회원가입이 완료되었습니다.");
      console.log("회원가입 응답:", data);
    },
    onError: (error: unknown) => {
      alert(`회원가입 실패: ${getErrorMessage(error)}`);
      console.log("에러 상세", error);
    },
  });

  return { sendCodeMutation, verifyCodeMutation, signupMutation };
};
