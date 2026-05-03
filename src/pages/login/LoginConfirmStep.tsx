import AuthButton from "../../components/auth/AuthButton";
import AuthScreenLayout from "../../components/auth/AuthScreenLayout";
import ScreenTitle from "../../components/auth/ScreenTitle";
import { AUTH } from "../../components/auth/authTheme";

type Props = {
  address: string;
  onConfirm: () => void;
  onBack: () => void;
  isPending: boolean;
};

export default function LoginConfirmStep({ address, onConfirm, onBack, isPending }: Props) {
  return (
    <AuthScreenLayout>
      <button type="button" onClick={onBack} className="text-sm text-gray-500 mb-4 self-start">
        ← Back
      </button>
      <ScreenTitle
        title="Confirm your wallet"
        subtitle="Sign the request in MetaMask to finish logging in."
      />
      <div className="rounded-[10px] border p-4 mb-8" style={{ borderColor: AUTH.border }}>
        <p className="text-xs font-semibold mb-1" style={{ color: AUTH.label }}>
          CONNECTED WALLET
        </p>
        <p className="text-sm font-mono break-all text-gray-900">{address}</p>
      </div>
      <div className="mt-auto flex flex-col gap-3">
        <AuthButton variant="primary" onClick={onConfirm} disabled={isPending}>
          {isPending ? "Confirming…" : "Confirm"}
        </AuthButton>
      </div>
    </AuthScreenLayout>
  );
}
