import LoginConfirmStep from "./LoginConfirmStep";
import LoginLanding from "./LoginLanding";
import LoginWalletStep from "./LoginWalletStep";
import { useWalletLogin } from "../../features/auth/login/useWalletLogin";

const Login = () => {
  const w = useWalletLogin();

  if (w.step === "landing") {
    return (
      <LoginLanding
        onSignIn={() => w.setStep("wallet")}
        onCreateAccount={() => w.navigate("/auth/signup")}
      />
    );
  }

  if (w.step === "confirm") {
    return (
      <LoginConfirmStep
        address={w.displayAddress}
        onConfirm={w.confirmLogin}
        onBack={() => w.setStep("wallet")}
        isPending={w.isPending}
      />
    );
  }

  return (
    <LoginWalletStep
      walletAddress={w.walletAddress}
      onWalletChange={w.handleWalletChange}
      onMetaMask={w.connectMetaMask}
      onSubmit={w.goToConfirm}
      onBack={() => w.setStep("landing")}
      onSignUp={() => w.navigate("/auth/signup")}
      isPending={w.isPending}
    />
  );
};

export default Login;
