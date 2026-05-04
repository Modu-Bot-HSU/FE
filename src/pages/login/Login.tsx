import { useNavigate } from "react-router-dom";
import LoginConfirmStep from "./LoginConfirmStep";
import LoginWalletStep from "./LoginWalletStep";
import { useWalletLogin } from "../../features/auth/login/useWalletLogin";

const Login = () => {
  const navigate = useNavigate();
  const w = useWalletLogin();

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
      onBack={() => navigate("/")}
      onSignUp={() => w.navigate("/auth/signup")}
      isPending={w.isPending}
    />
  );
};

export default Login;
