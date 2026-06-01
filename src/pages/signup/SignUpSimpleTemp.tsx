import AuthButton from "../../components/auth/AuthButton";
import AuthLabeledInput from "../../components/auth/AuthLabeledInput";
import AuthScreenLayout from "../../components/auth/AuthScreenLayout";
import MetaMaskAuthButton from "../../components/auth/MetaMaskAuthButton";
import ScreenTitle from "../../components/auth/ScreenTitle";
import type { SignUpCompleteProfile } from "../../features/auth/signup/signUpWalletActions";

type Props = {
  email: string;
  name: string;
  walletAddress: string;
  onEmailChange: (v: string) => void;
  onNameChange: (v: string) => void;
  onWalletChange: (v: string) => void;
  onMetaMask: () => void;
  onSubmit: () => Promise<SignUpCompleteProfile | null>;
  isPending: boolean;
  onBack: () => void;
  onSuccess: (profile: SignUpCompleteProfile) => void;
};

export default function SignUpSimpleTemp({
  email,
  name,
  walletAddress,
  onEmailChange,
  onNameChange,
  onWalletChange,
  onMetaMask,
  onSubmit,
  isPending,
  onBack,
  onSuccess,
}: Props) {
  const submit = async () => {
    const profile = await onSubmit();
    if (profile) onSuccess(profile);
  };

  return (
    <AuthScreenLayout>
      <div className="flex min-h-0 flex-1 flex-col">
        <div
          className="mb-6 rounded-xl border px-3 py-2.5 text-xs leading-relaxed text-amber-900"
          style={{ borderColor: "#FCD34D", backgroundColor: "#FFFBEB" }}
        >
          <strong>임시 가입</strong>: 이메일 인증 단계는 생략됩니다. 서버에서 인증된 것으로 처리해 주시면 됩니다. 아래
          정보만 입력한 뒤 가입을 완료해 주세요.
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1">
            <ScreenTitle
              title="Create your account"
              subtitle="이메일, 이름, 지갑 주소를 입력한 뒤 가입을 완료합니다."
            />

            <div className="flex flex-col gap-4">
              <AuthLabeledInput
                label="UNIVERSITY EMAIL"
                name="email"
                type="email"
                placeholder="you@hansung.ac.kr"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                hint="한성대 공식 이메일(@hansung.ac.kr)만 사용할 수 있습니다."
              />
              <AuthLabeledInput
                label="FULL NAME"
                name="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
              />
              <AuthLabeledInput
                label="WALLET ADDRESS"
                name="walletAddress"
                placeholder="0x0000...0000"
                value={walletAddress}
                onChange={(e) => onWalletChange(e.target.value)}
                hint="MetaMask로 연결하거나 주소를 직접 입력하세요."
              />

              <div className="relative flex items-center gap-3 py-1">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="shrink-0 text-xs text-gray-500">or connect with MetaMask</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <MetaMaskAuthButton type="button" onClick={onMetaMask}>
                Connect MetaMask
              </MetaMaskAuthButton>
            </div>
          </div>

          <div className="shrink-0 pt-6">
            <AuthButton variant="primary" onClick={() => void submit()} disabled={isPending}>
              {isPending ? "Creating…" : "Create account"}
            </AuthButton>
            <button
              type="button"
              onClick={onBack}
              className="mt-6 w-full py-2 text-center text-sm text-gray-500"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </AuthScreenLayout>
  );
}
