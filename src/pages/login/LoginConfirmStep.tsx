import AuthButton from "../../components/auth/AuthButton";
import AuthScreenLayout from "../../components/auth/AuthScreenLayout";
import ScreenTitle from "../../components/auth/ScreenTitle";
import { AUTH } from "../../components/auth/authTheme";
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
    <AuthScreenLayout className="justify-between">
      <div>
        <ScreenTitle
          title="Confirm your wallet"
          subtitle="Sign the request in MetaMask to verify ownership."
        />
        <div
          className="rounded-[10px] border bg-white p-4 mt-2"
          style={{ borderColor: AUTH.border }}
        >
          <p className="text-xs font-semibold tracking-wide mb-2" style={{ color: AUTH.label }}>
            CONNECTED WALLET
          </p>
          <p
            className="text-base font-semibold font-mono tracking-tight"
            style={{ color: AUTH.navy }}
          >
            {shortAddress}
          </p>
          <hr className="my-3 border-0 border-t" style={{ borderColor: AUTH.border }} />
          <p className="text-xs leading-relaxed text-gray-500">
            ModuBot will ask MetaMask to sign a message to confirm you own this wallet. This does
            not cost any gas.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4 pt-6">
        <AuthButton variant="primary" onClick={onConfirm} disabled={isPending}>
          {isPending ? "Confirming…" : "Confirm"}
        </AuthButton>
        <button type="button" onClick={onBack} className="text-sm text-gray-500 text-center">
          ← Back
        </button>
      </div>
    </AuthScreenLayout>
  );
}
