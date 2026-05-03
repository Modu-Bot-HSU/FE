import AuthButton from "../../components/auth/AuthButton";
import AuthScreenLayout from "../../components/auth/AuthScreenLayout";
type Props = {
  onSignIn: () => void;
  onCreateAccount: () => void;
};

export default function LoginLanding({ onSignIn, onCreateAccount }: Props) {
  return (
    <AuthScreenLayout className="justify-center items-stretch">
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-10">
        <div>
          <p className="text-3xl font-bold tracking-tight text-gray-900">ModuBot</p>
          <p className="text-gray-500 mt-3 text-sm px-2">Ask your ModuBot about anything.</p>
        </div>
        <div className="w-full flex flex-col gap-3 mt-4">
          <AuthButton variant="primary" onClick={onSignIn}>
            Sign in
          </AuthButton>
          <AuthButton variant="secondary" onClick={onCreateAccount}>
            Create account
          </AuthButton>
        </div>
      </div>
    </AuthScreenLayout>
  );
}
