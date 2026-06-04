import { useEffect, useRef } from "react";
import { useWalletLogin } from "../../features/auth/login/useWalletLogin";
import LoginConfirmStep from "./LoginConfirmStep";
import LoginWalletStep from "./LoginWalletStep";

const Login = () => {
  const w = useWalletLogin();
  const autoConnectTriedRef = useRef(false);

  // ✨ [추가] 모바일 메타마스크 인앱 브라우저 진입 시 자동 로그인 플로우 실행
  useEffect(() => {
    if (autoConnectTriedRef.current) return;

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isMetaMaskApp = Boolean(window.ethereum) && /MetaMask/i.test(navigator.userAgent);
    
    // 2. 메타마스크 앱 내부이면서, 아직 1단계(wallet)에 머물러 있다면 자동으로 지갑 연결 프로세스 실행
    if (isMobile && isMetaMaskApp && w.step === "wallet" && typeof w.connectMetaMask === "function") {
      autoConnectTriedRef.current = true;
      void w.connectMetaMask();
    }
  }, [w.step, w.connectMetaMask]); // 의존성 배열에 추가

  // 2단계: 서명 확인 단계
  if (w.step === "confirm") {
    return (
      <LoginConfirmStep
        address={w.displayAddress}
        onConfirm={() => void w.confirmLogin()}
        onBack={() => w.setStep("wallet")}
        isPending={w.isPending}
      />
    );
  }

  // 1단계: 지갑 주소 입력 및 메타마스크 연결 단계
  return (
    <LoginWalletStep
      walletAddress={w.walletAddress}
      onWalletChange={w.handleWalletChange}
      onMetaMask={() => void w.connectMetaMask()}
      onSubmit={() => void w.goToConfirm()}
      onSignUp={() => w.navigate("/auth/signup")}
      isPending={w.isNavigatingToConfirm}
    />
  );
};

export default Login;