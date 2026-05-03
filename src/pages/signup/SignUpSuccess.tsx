import { useNavigate } from "react-router-dom";
import AuthButton from "../../components/auth/AuthButton";
import AuthScreenLayout from "../../components/auth/AuthScreenLayout";
import { AUTH } from "../../components/auth/authTheme";

type Profile = { email: string; wallet: string };

type Props = {
  profile: Profile;
};

export default function SignUpSuccess({ profile }: Props) {
  const navigate = useNavigate();

  return (
    <AuthScreenLayout className="justify-center">
      <div className="flex flex-col items-center text-center flex-1 justify-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-6"
          style={{ backgroundColor: `${AUTH.primary}22` }}
        >
          ✓
        </div>
        <h1 className="text-2xl font-bold text-gray-900">You&apos;re in!</h1>
        <p className="text-gray-500 mt-2 text-sm px-2">
          Your account is ready. Welcome to ModuBot.
        </p>
        <div
          className="w-full mt-8 rounded-[10px] border text-left p-4 space-y-3"
          style={{ borderColor: AUTH.border }}
        >
          <div>
            <p className="text-xs font-semibold" style={{ color: AUTH.label }}>
              Email
            </p>
            <p className="text-sm break-all">{profile.email}</p>
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color: AUTH.label }}>
              Wallet
            </p>
            <p className="text-xs font-mono break-all">{profile.wallet}</p>
          </div>
        </div>
        <div className="w-full mt-10">
          <AuthButton variant="primary" onClick={() => navigate("/")}>
            Go to ModuBot
          </AuthButton>
        </div>
      </div>
    </AuthScreenLayout>
  );
}
