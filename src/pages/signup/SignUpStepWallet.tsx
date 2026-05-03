import AuthButton from "../../components/auth/AuthButton";
import AuthLabeledInput from "../../components/auth/AuthLabeledInput";
import MetaMaskAuthButton from "../../components/auth/MetaMaskAuthButton";
import ScreenTitle from "../../components/auth/ScreenTitle";
import { AUTH } from "../../components/auth/authTheme";

type Props = {
  email: string;
  walletAddress: string;
  onWalletChange: React.ChangeEventHandler<HTMLInputElement>;
  onMetaMask: () => void;
  onSubmit: () => Promise<void>;
  onBack: () => void;
  isPending: boolean;
};

export default function SignUpStepWallet({
  email,
  walletAddress,
  onWalletChange,
  onMetaMask,
  onSubmit,
  onBack,
  isPending,
}: Props) {
  return (
    <div className="flex flex-col flex-1">
      <button type="button" onClick={onBack} className="text-sm text-gray-500 mb-4 self-start">
        ← Back
      </button>
      <ScreenTitle
        title="Connect your wallet"
        subtitle="Link your MetaMask wallet to finish signup."
      />
      <div
        className="flex items-center justify-between rounded-[10px] border px-3 py-2.5 mb-4"
        style={{ borderColor: AUTH.border }}
      >
        <span className="text-sm text-gray-700 truncate mr-2">{email}</span>
        <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded shrink-0">
          Verified
        </span>
      </div>
      <div className="flex flex-col gap-4 flex-1">
        <AuthLabeledInput
          label="WALLET ADDRESS"
          name="walletAddress"
          placeholder="0x..."
          value={walletAddress}
          onChange={onWalletChange}
        />
        <MetaMaskAuthButton type="button" onClick={onMetaMask}>
          Connect MetaMask
        </MetaMaskAuthButton>
        <div className="mt-auto pt-6">
          <AuthButton variant="primary" onClick={() => void onSubmit()} disabled={isPending}>
            {isPending ? "Creating…" : "Create account"}
          </AuthButton>
        </div>
      </div>
    </div>
  );
}
