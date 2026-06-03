import AuthButton from "../../components/auth/AuthButton";
import AuthScreenLayout from "../../components/auth/AuthScreenLayout";
import ScreenTitle from "../../components/auth/ScreenTitle";
import { LOGIN_UI } from "../../components/auth/authTheme";
import { truncateMiddleWalletAddress } from "../../utils/walletDisplay";

type Props = {
  address: string;
  onConfirm: () => void;
  onBack: () => void;
  isPending: boolean;
};

export default function LoginConfirmStep({ address, onConfirm, onBack, isPending }: Props) {
  const shortAddress = truncateMiddleWalletAddress(address);

  return (
    <AuthScreenLayout className="flex min-h-0 flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col">
        <ScreenTitle
          variant="login"
          title="Confirm your wallet"
          subtitle="Sign the request in MetaMask to verify ownership"
        />

        <div
          className="rounded-[10px] border bg-white px-4 py-4"
          style={{ borderColor: LOGIN_UI.border }}
        >
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: LOGIN_UI.body }}
          >
            CONNECTED WALLET
          </p>
          <p className="mt-2 font-mono text-lg font-semibold tracking-tight" style={{ color: LOGIN_UI.heading }}>
            {shortAddress}
          </p>
          <hr className="my-4 border-0 border-t" style={{ borderColor: LOGIN_UI.border }} />
          <p className="text-[13px] leading-relaxed" style={{ color: LOGIN_UI.body }}>
            ModuBot will ask MetaMask to sign a message to confirm you own this wallet. This does not
            cost any gas.
          </p>
        </div>

        <div className="mt-auto flex flex-col gap-5 pt-12">
          <AuthButton
            variant="primary"
            style={{ backgroundColor: LOGIN_UI.primary }}
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Confirming…" : "Confirm"}
          </AuthButton>
          <button
            type="button"
            onClick={onBack}
            className="w-full py-2 text-center text-sm font-medium"
            style={{ color: LOGIN_UI.body }}
          >
            ← Back
          </button>
        </div>
      </div>
    </AuthScreenLayout>
  );
}
