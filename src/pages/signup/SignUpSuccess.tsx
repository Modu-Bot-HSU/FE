import { useNavigate } from "react-router-dom";
import AuthButton from "../../components/auth/AuthButton";
import AuthScreenLayout from "../../components/auth/AuthScreenLayout";
import { LOGIN_UI } from "../../components/auth/authTheme";
import { truncateMiddleWalletAddress } from "../../utils/walletDisplay";

type Profile = { email: string; wallet: string };

type Props = {
  profile: Profile;
};

export default function SignUpSuccess({ profile }: Props) {
  const navigate = useNavigate();
  const shortWallet = truncateMiddleWalletAddress(profile.wallet);

  return (
    <AuthScreenLayout className="justify-center">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#0F253E] text-3xl text-white">
          ✓
        </div>
        <h1 className="font-serif text-[32px] font-bold text-[#0F253E]">You&apos;re in!</h1>
        <p className="mt-3 px-2 text-sm leading-relaxed" style={{ color: LOGIN_UI.body }}>
          Your account is ready. Welcome to ModuBot.
        </p>

        <div className="mt-10 w-full text-left">
          <p
            className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: LOGIN_UI.body }}
          >
            ACCOUNT
          </p>
          <div
            className="overflow-hidden rounded-[10px] border bg-white"
            style={{ borderColor: LOGIN_UI.border }}
          >
            <div
              className="grid grid-cols-[88px_1fr] gap-3 border-b px-4 py-3.5 text-sm"
              style={{ borderColor: LOGIN_UI.border }}
            >
              <span className="font-semibold text-[#0F253E]">Email</span>
              <span className="truncate text-right text-[#717171]">{profile.email}</span>
            </div>
            <div className="grid grid-cols-[88px_1fr] gap-3 px-4 py-3.5 text-sm">
              <span className="font-semibold text-[#0F253E]">Wallet</span>
              <span className="truncate text-right font-mono text-[#717171]">{shortWallet}</span>
            </div>
          </div>
        </div>

        <div className="mt-10 w-full">
          <AuthButton
            variant="primary"
            style={{ backgroundColor: LOGIN_UI.primary }}
            onClick={() => navigate("/chat")}
          >
            Go to ModuBot
          </AuthButton>
        </div>
      </div>
    </AuthScreenLayout>
  );
}
