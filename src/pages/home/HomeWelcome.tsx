import { useNavigate } from "react-router-dom";
import AuthButton from "../../components/auth/AuthButton";
import AuthScreenLayout from "../../components/auth/AuthScreenLayout";
import logoUrl from "../../assets/logo.svg";

export default function HomeWelcome() {
  const navigate = useNavigate();

  return (
    <AuthScreenLayout className="bg-white justify-between">
      <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
        <img src={logoUrl} alt="ModuBot" className="w-[min(78vw,280px)] h-auto select-none" />
        <p className="text-gray-500 mt-6 text-sm max-w-sm leading-relaxed">
          Ask your ModuBot about anything.
        </p>
      </div>
      <div className="w-full flex flex-col gap-3 pb-2">
        <AuthButton variant="primary" onClick={() => navigate("/auth/login")}>
          Sign in
        </AuthButton>
        <AuthButton variant="secondary" onClick={() => navigate("/auth/signup")}>
          Create account
        </AuthButton>
        <p className="text-center text-xs text-gray-400 pt-2">
          University email required to sign up
        </p>
      </div>
    </AuthScreenLayout>
  );
}
