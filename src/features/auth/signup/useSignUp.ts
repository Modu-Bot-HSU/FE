import { useEffect, useState } from "react";
import { formatCountdown } from "./signUpHelpers";
import {
  runConnectMetaMask,
  runSignUpComplete,
} from "./signUpWalletActions";
import { runSendUniversityCode, runVerifyEmailCode } from "./signUpEmailActions";
import { useSignUpMutations } from "./useSignUpMutations";

export const useSignUp = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [name, setName] = useState("");
  const [isSignUpCompleted, setIsSignUpCompleted] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [walletSessionSeconds, setWalletSessionSeconds] = useState(0);
  const [successProfile, setSuccessProfile] = useState<{
    email: string;
    wallet: string;
  } | null>(null);

  const { sendCodeMutation, verifyCodeMutation, completeSignupMutation } = useSignUpMutations({
    setRemainingSeconds,
    setWalletSessionSeconds,
    setIsEmailVerified,
    setIsSignUpCompleted,
    setSuccessProfile,
  });

  useEffect(() => {
    if (remainingSeconds <= 0) return;
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

  useEffect(() => {
    if (walletSessionSeconds <= 0) return;
    const timer = window.setInterval(() => {
      setWalletSessionSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setIsEmailVerified(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [walletSessionSeconds]);

  const handleSendVerificationCode = () => runSendUniversityCode(email, name, sendCodeMutation);

  const handleVerifyCode = () =>
    runVerifyEmailCode(email, code, remainingSeconds, verifyCodeMutation);

  const handleComplete = () => {
    if (!isEmailVerified || walletSessionSeconds <= 0) {
      alert("이메일 인증을 먼저 완료해주세요. 세션이 만료되었다면 인증 코드를 다시 확인해주세요.");
      return Promise.resolve(false);
    }
    return runSignUpComplete(email, walletAddress, setWalletAddress, completeSignupMutation);
  };

  const connectMetaMaskToForm = () => runConnectMetaMask(setWalletAddress);

  return {
    email,
    setEmail,
    code,
    setCode,
    walletAddress,
    setWalletAddress,
    name,
    setName,
    isSignUpCompleted,
    isEmailVerified,
    walletSessionSeconds,
    remainingSeconds,
    countdownLabel: formatCountdown(remainingSeconds),
    walletSessionLabel: formatCountdown(walletSessionSeconds),
    isPending: completeSignupMutation.isPending,
    sendCodeMutation,
    verifyCodeMutation,
    handleSendVerificationCode,
    handleVerifyCode,
    handleComplete,
    successProfile,
    connectMetaMaskToForm,
    onEmailChange: (value: string) => {
      setEmail(value);
      setIsEmailVerified(false);
      setWalletSessionSeconds(0);
      setWalletAddress("");
    },
  };
};
