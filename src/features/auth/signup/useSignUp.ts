import { useEffect, useState } from "react";
import { formatCountdown } from "./signUpHelpers";
import { runConnectMetaMask, runSignUpComplete } from "./signUpWalletActions";
import { runSendUniversityCode, runVerifyEmailCode } from "./signUpEmailActions";
import { useSignUpMutations } from "./useSignUpMutations";

export const useSignUp = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [name, setName] = useState("");
  const [signupWalletAddress, setSignupWalletAddress] = useState("");
  const [isSignUpCompleted, setIsSignUpCompleted] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [successProfile, setSuccessProfile] = useState<{
    email: string;
    wallet: string;
  } | null>(null);

  const { sendCodeMutation, verifyCodeMutation, signupMutation } = useSignUpMutations({
    setRemainingSeconds,
    setIsEmailVerified,
    setIsSignUpCompleted,
    setSignupWalletAddress,
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

  const handleSendVerificationCode = () =>
    runSendUniversityCode(email, name, signupWalletAddress, sendCodeMutation);

  const handleVerifyCode = () =>
    runVerifyEmailCode(email, code, remainingSeconds, signupWalletAddress, verifyCodeMutation);

  const handleComplete = () =>
    runSignUpComplete(email, name, walletAddress, setWalletAddress, signupMutation);

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
    remainingSeconds,
    countdownLabel: formatCountdown(remainingSeconds),
    isPending: signupMutation.isPending,
    sendCodeMutation,
    verifyCodeMutation,
    handleComplete,
    handleSendVerificationCode,
    handleVerifyCode,
    successProfile,
    connectMetaMaskToForm,
    onEmailChange: (value: string) => {
      setEmail(value);
      setIsEmailVerified(false);
    },
  };
};
