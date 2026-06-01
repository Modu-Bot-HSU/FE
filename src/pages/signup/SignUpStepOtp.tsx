import AuthBackLink from "../../components/auth/AuthBackLink";
import AuthButton from "../../components/auth/AuthButton";
import OtpCodeInput from "../../components/auth/OtpCodeInput";
import SignUpProgressBar from "../../components/auth/SignUpProgressBar";
import { LOGIN_UI } from "../../components/auth/authTheme";

type Props = {
  email: string;
  code: string;
  onCodeChange: (v: string) => void;
  onVerify: () => Promise<void>;
  onResend: () => Promise<void>;
  onBack: () => void;
  verifyPending: boolean;
  resendPending: boolean;
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
  remainingSeconds,
}: Props) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <SignUpProgressBar step={2} />

      <header className="mb-8">
        <h1 className="font-serif text-[28px] font-bold leading-tight tracking-tight text-[#0F253E]">
          Check your email
        </h1>
        <div
          className="mt-3 text-[15px] leading-relaxed"
          style={{ color: LOGIN_UI.body }}
        >
          <p>We sent a 6-digit code to</p>
          <p className="mt-1 font-semibold text-[#0F253E]">
            {email || "your inbox"}
          </p>
        </div>
      </header>

      <div>
        <p
          className="mb-2 text-xs font-semibold uppercase tracking-wide"
          style={{ color: LOGIN_UI.body }}
        >
          VERIFICATION CODE
        </p>
        <OtpCodeInput
          value={code}
          onChange={onCodeChange}
          disabled={verifyPending}
        />
      </div>

      <div className="mt-auto">
        <p className="mb-6 text-sm" style={{ color: LOGIN_UI.body }}>
          Didn&apos;t get it?{" "}
          <button
            type="button"
            onClick={() => void onResend()}
            disabled={resendPending || remainingSeconds > 0}
            className="font-semibold underline-offset-2 hover:underline disabled:opacity-40"
            style={{ color: LOGIN_UI.primary }}
          >
            Resend code
          </button>
        </p>

        <AuthButton
          variant="primary"
          style={{ backgroundColor: LOGIN_UI.primary }}
          onClick={() => void onVerify()}
          disabled={verifyPending || code.length !== 6}
        >
          {verifyPending ? "Verifying…" : "Verify"}
        </AuthButton>
        <AuthBackLink onClick={onBack} />
      </div>
    </div>
  );
}
