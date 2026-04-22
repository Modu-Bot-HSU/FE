import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  buildPersonalSignPayload,
  extractAccessToken,
  getNonce,
  login,
  normalizeWalletAddress,
  sendEmailVerificationCode,
  signup,
  type LoginRequest,
  type NonceResponse,
  type SignUpResponse,
  verifyEmailCode,
  type SignUpRequest,
} from "../../apis/auth/auth";
import { formatCountdown, getErrorMessage, isHansungEmail } from "./signUpHelpers";

export const useSignUp = () => {
  const [email, setEmail] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [code, setCode] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [name, setName] = useState("");
  const [signupWalletAddress, setSignupWalletAddress] = useState("");
  const [isSignUpCompleted, setIsSignUpCompleted] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [remainingSeconds]);

  const sendCodeMutation = useMutation({
    mutationFn: (requestEmail: string) =>
      sendEmailVerificationCode({ email: requestEmail }),
    onSuccess: (data) => {
      setRemainingSeconds(300);
      setIsEmailVerified(false);
      alert(data.message);
    },
    onError: (error: unknown) => {
      alert(`인증번호 전송 실패: ${getErrorMessage(error)}`);
    },
  });

  const verifyCodeMutation = useMutation({
    mutationFn: (payload: { email: string; code: string }) =>
      verifyEmailCode(payload),
    onSuccess: (data) => {
      setIsEmailVerified(true);
      setRemainingSeconds(0);
      alert(data.message);
    },
    onError: (error: unknown) => {
      alert(`인증번호 확인 실패: ${getErrorMessage(error)}`);
    },
  });

  const { mutate, isPending } = useMutation<SignUpResponse, unknown, SignUpRequest>({
    mutationFn: (data: SignUpRequest) => signup(data),
    onSuccess: (data, variables) => {
      localStorage.removeItem("accessToken");
      setVerificationEmail("");
      setIsSignUpCompleted(true);
      setSignupWalletAddress(normalizeWalletAddress(variables.walletAddress));
      alert("회원가입이 완료되었습니다.");
      console.log("회원가입 응답:", data);
    },
    onError: (error: unknown) => {
      alert(`회원가입 실패: ${getErrorMessage(error)}`);
      console.log("에러 상세", error);
    },
  });

  const ensureAccessToken = async (forceRefresh = false) => {
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
    console.log("재발급된 accessToken 저장 완료");
    return true;
  };

  const handleSendVerificationCode = async () => {
    const confirm = verificationEmail.trim();
    if (!isHansungEmail(confirm)) {
      alert("한성대학교 이메일(@hansung.ac.kr)만 사용 가능합니다.");
      return;
    }

    if (sendCodeMutation.isPending) {
      return;
    }

    try {
      const isAuthorized = await ensureAccessToken(true);
      if (!isAuthorized) {
        return;
      }
    } catch (error: unknown) {
      alert(`인증 전 로그인 처리 실패: ${getErrorMessage(error)}`);
      return;
    }

    sendCodeMutation.mutate(confirm);
  };

  const handleVerifyCode = async () => {
    const confirm = verificationEmail.trim();
    if (!confirm) {
      alert("이메일을 입력해주세요.");
      return;
    }

    if (remainingSeconds === 0) {
      alert("인증 시간이 만료되었습니다. 인증번호를 다시 요청해주세요.");
      return;
    }

    if (code.length !== 6) {
      alert("6자리 인증번호를 입력해주세요.");
      return;
    }

    try {
      const isAuthorized = await ensureAccessToken(true);
      if (!isAuthorized) {
        return;
      }
    } catch (error: unknown) {
      alert(`인증 전 로그인 처리 실패: ${getErrorMessage(error)}`);
      return;
    }

    verifyCodeMutation.mutate({ email: confirm, code });
  };

  const handleComplete = async () => {
    if (!isHansungEmail(email)) {
      alert("한성대학교 이메일만 사용 가능합니다.");
      return;
    }

    const trimmedWalletAddress = walletAddress.trim();

    if (!trimmedWalletAddress || !name) {
      alert("이메일, 지갑주소, 이름을 입력해주세요.");
      return;
    }

    if (!/^0x/i.test(trimmedWalletAddress) || trimmedWalletAddress.length !== 42) {
      alert("올바른 지갑 주소를 입력해주세요.");
      return;
    }

    if (!window.ethereum) {
      alert("회원가입 전 메타마스크 연결이 필요합니다.");
      return;
    }

    const accounts = (await window.ethereum.request({
      method: "eth_requestAccounts",
    })) as string[];
    const activeAccountRaw = (accounts[0] ?? "").trim();
    if (!activeAccountRaw) {
      alert("메타마스크 계정을 선택해주세요.");
      return;
    }

    if (
      normalizeWalletAddress(trimmedWalletAddress) !==
      normalizeWalletAddress(activeAccountRaw)
    ) {
      alert(
        "입력한 지갑 주소와 메타마스크에서 선택한 계정이 다릅니다. 주소를 맞추거나 메타마스크 계정을 바꿔주세요.",
      );
      return;
    }

    setWalletAddress(activeAccountRaw);

    mutate({
      email,
      walletAddress: activeAccountRaw,
      name,
    });
  };

  return {
    email,
    setEmail,
    verificationEmail,
    setVerificationEmail,
    code,
    setCode,
    walletAddress,
    setWalletAddress,
    name,
    setName,
    isSignUpCompleted,
    isEmailVerified,
    remainingSeconds,
    countdownLabel: formatCountdown(remainingSeconds),
    isPending,
    sendCodeMutation,
    verifyCodeMutation,
    handleComplete,
    handleSendVerificationCode,
    handleVerifyCode,
    onEmailChange: (value: string) => {
      setEmail(value);
      setIsEmailVerified(false);
    },
    onVerificationEmailChange: (value: string) => {
      setVerificationEmail(value);
      setIsEmailVerified(false);
    },
  };
};
