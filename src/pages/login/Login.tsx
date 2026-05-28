import { useWalletLogin } from "../../features/auth/login/useWalletLogin";
import LoginConfirmStep from "./LoginConfirmStep";
import LoginWalletStep from "./LoginWalletStep";

const Login = () => {
  const w = useWalletLogin();

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
