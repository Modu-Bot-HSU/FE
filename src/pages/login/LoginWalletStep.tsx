import AuthButton from "../../components/auth/AuthButton";
import AuthLabeledInput from "../../components/auth/AuthLabeledInput";
import AuthScreenLayout from "../../components/auth/AuthScreenLayout";
import MetaMaskAuthButton from "../../components/auth/MetaMaskAuthButton";
import ScreenTitle from "../../components/auth/ScreenTitle";

type Props = {
  walletAddress: string;
  onWalletChange: React.ChangeEventHandler<HTMLInputElement>;
  onMetaMask: () => void;
  onSubmit: () => void;
  onBack: () => void;
  onSignUp: () => void;
  isPending: boolean;
};

export default function LoginWalletStep({
  walletAddress,
  onWalletChange,
  onMetaMask,
  onSubmit,
  onBack,
  onSignUp,
  isPending,
}: Props) {
  return (
    <AuthScreenLayout>
      <button type="button" onClick={onBack} className="text-sm text-gray-500 mb-4 self-start">
        ← Back
      </button>
      <ScreenTitle title="Welcome back" subtitle="Log in with your wallet" />
      <div className="flex flex-col gap-4 flex-1">
        <AuthLabeledInput
          label="WALLET ADDRESS"
          name="walletAddress"
          placeholder="0x..."
          value={walletAddress}
          onChange={onWalletChange}
          autoComplete="off"
        />
        <MetaMaskAuthButton type="button" onClick={onMetaMask}>
          Sign in with MetaMask
        </MetaMaskAuthButton>
        <AuthButton variant="primary" onClick={onSubmit} disabled={isPending}>
          {isPending ? "Signing in…" : "Sign in"}
        </AuthButton>
        <p className="text-center text-sm text-gray-500 mt-auto pt-6">
          Don&apos;t have an account?{" "}
          <button type="button" onClick={onSignUp} className="text-[#FF5C00] font-semibold underline">
            Sign up
          </button>
        </p>
      </div>
    </AuthScreenLayout>
  );
}
