import AuthButton from "../../components/auth/AuthButton";
import OtpCodeInput from "../../components/auth/OtpCodeInput";
import ScreenTitle from "../../components/auth/ScreenTitle";

type Props = {
  email: string;
  code: string;
  onCodeChange: (v: string) => void;
  onVerify: () => Promise<void>;
  onResend: () => Promise<void>;
  onBack: () => void;
  verifyPending: boolean;
  resendPending: boolean;
  countdownLabel: string;
  remainingSeconds: number;
};

export default function SignUpStepOtp({
  email,
  code,
  onCodeChange,
  onVerify,
  onResend,
  onBack,
  verifyPending,
  resendPending,
  countdownLabel,
  remainingSeconds,
}: Props) {
  return (
    <div className="flex flex-col flex-1">
      <button type="button" onClick={onBack} className="text-sm text-gray-500 mb-4 self-start">
        ← Back
      </button>
      <ScreenTitle
        title="Check your email"
        subtitle={`We sent a 6-digit code to ${email || "your inbox"}.`}
      />
      <OtpCodeInput value={code} onChange={onCodeChange} disabled={verifyPending} />
      <div className="flex justify-between items-center mt-4 text-sm">
        <span className="text-gray-500">
          {remainingSeconds > 0 ? `Expires in ${countdownLabel}` : "Code expired"}
        </span>
        <button
          type="button"
          onClick={() => void onResend()}
          disabled={resendPending}
          className="text-[#FF5C00] font-semibold underline disabled:opacity-40"
        >
          Resend code
        </button>
      </div>
      <div className="mt-auto pt-8">
        <AuthButton variant="primary" onClick={() => void onVerify()} disabled={verifyPending}>
          {verifyPending ? "Verifying…" : "Verify"}
        </AuthButton>
      </div>
    </div>
  );
}
