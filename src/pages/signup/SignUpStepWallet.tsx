import AuthBackLink from "../../components/auth/AuthBackLink";
import AuthButton from "../../components/auth/AuthButton";
import AuthLabeledInput from "../../components/auth/AuthLabeledInput";
import MetaMaskAuthButton from "../../components/auth/MetaMaskAuthButton";
import SignUpProgressBar from "../../components/auth/SignUpProgressBar";
import { LOGIN_UI } from "../../components/auth/authTheme";

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
    <div className="flex min-h-0 flex-1 flex-col">
      <SignUpProgressBar step={3} />

      <header className="mb-6">
        <h1 className="font-serif text-[28px] font-bold leading-tight tracking-tight text-[#0F253E]">
          Connect your wallet
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed" style={{ color: LOGIN_UI.body }}>
          Sign the request in MetaMask to verify wallet ownership
        </p>
      </header>

      <div>
        <p
          className="mb-1.5 text-xs font-semibold uppercase tracking-wide"
          style={{ color: LOGIN_UI.body }}
        >
          UNIVERSITY EMAIL
        </p>
        <div
          className="flex items-center justify-between rounded-[10px] border bg-white px-3 py-3"
          style={{ borderColor: LOGIN_UI.border }}
        >
          <span className="mr-2 truncate text-sm text-[#0F253E]">{email}</span>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#0F253E] px-2.5 py-1 text-[11px] font-semibold text-white">
            ✓ Verified
          </span>
        </div>
      </div>

      <div className="mt-5 flex min-h-0 flex-1 flex-col gap-4">
        <AuthLabeledInput
          loginTone
          label="WALLET ADDRESS"
          name="walletAddress"
          placeholder="0x0000...0000"
          value={walletAddress}
          onChange={onWalletChange}
          autoComplete="off"
          hint="MetaMask will ask you to sign a message to verify ownership"
        />

        <div className="relative flex items-center gap-3">
          <div className="h-px flex-1" style={{ backgroundColor: LOGIN_UI.border }} />
          <span className="shrink-0 px-1 text-xs text-[#9CA3AF]">or connect with MetaMask</span>
          <div className="h-px flex-1" style={{ backgroundColor: LOGIN_UI.border }} />
        </div>

        <MetaMaskAuthButton type="button" style={{ backgroundColor: LOGIN_UI.metaMask }} onClick={onMetaMask}>
          Connect MetaMask
        </MetaMaskAuthButton>

        <div className="mt-auto pt-6">
          <AuthButton
            variant="primary"
            style={{ backgroundColor: LOGIN_UI.primary }}
            onClick={() => void onSubmit()}
            disabled={isPending}
          >
            {isPending ? "Verifying wallet…" : "Create account"}
          </AuthButton>
          <AuthBackLink onClick={onBack} />
        </div>
      </div>
    </div>
  );
}
