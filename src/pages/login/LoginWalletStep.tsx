import AuthButton from "../../components/auth/AuthButton";
import AuthLabeledInput from "../../components/auth/AuthLabeledInput";
import AuthScreenLayout from "../../components/auth/AuthScreenLayout";
import MetaMaskAuthButton from "../../components/auth/MetaMaskAuthButton";
import ScreenTitle from "../../components/auth/ScreenTitle";
import { LOGIN_UI } from "../../components/auth/authTheme";

type Props = {
  walletAddress: string;
  onWalletChange: React.ChangeEventHandler<HTMLInputElement>;
  onMetaMask: () => void;
  onSubmit: () => void | Promise<void>;
  onSignUp: () => void;
  isPending: boolean;
};

export default function LoginWalletStep({
  walletAddress,
  onWalletChange,
  onMetaMask,
  onSubmit,
  onSignUp,
  isPending,
}: Props) {
  return (
    <AuthScreenLayout className="flex min-h-0 flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col">
        <ScreenTitle variant="login" title="Welcome back" subtitle="Log in with your wallet" />

        <div className="flex min-h-0 flex-1 flex-col gap-0">
          <AuthLabeledInput
            loginTone
            label="WALLET ADDRESS"
            name="walletAddress"
            placeholder="0x0000...0000"
            value={walletAddress}
            onChange={onWalletChange}
            autoComplete="off"
            hint="Enter your MetaMask wallet address"
          />

          <div className="relative my-8 flex items-center gap-3">
            <div className="h-px flex-1" style={{ backgroundColor: LOGIN_UI.border }} />
            <span className="shrink-0 px-1 text-xs font-medium text-[#9ca3af]">or</span>
            <div className="h-px flex-1" style={{ backgroundColor: LOGIN_UI.border }} />
          </div>

          <MetaMaskAuthButton type="button" style={{ backgroundColor: LOGIN_UI.metaMask }} onClick={onMetaMask}>
            Sign in with MetaMask
          </MetaMaskAuthButton>

          <div className="mt-auto flex flex-col pt-10">
            <AuthButton
              variant="primary"
              style={{ backgroundColor: LOGIN_UI.primary }}
              onClick={() => void onSubmit()}
              disabled={isPending}
            >
              {isPending ? "Signing in…" : "Sign in"}
            </AuthButton>
            <p className="mt-8 text-center text-sm" style={{ color: LOGIN_UI.body }}>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={onSignUp}
                className="font-semibold underline-offset-2 hover:underline"
                style={{ color: LOGIN_UI.primary }}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </AuthScreenLayout>
  );
}
