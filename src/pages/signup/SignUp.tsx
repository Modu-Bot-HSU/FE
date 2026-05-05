import SignUpEmailVerificationSection from "./SignUpEmailVerificationSection";
import SignUpRegisterSection from "./SignUpRegisterSection";
import { useSignUp } from "./useSignUp";
import AuthPageLayout from "../../components/common/AuthPageLayout";

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const s = useSignUp();

  if (step === 4 && s.successProfile) {
    return <SignUpSuccess profile={s.successProfile} />;
  }

  return (
    <AuthPageLayout title="회원가입">

      {step === 2 ? (
        <SignUpStepOtp
          email={s.email}
          code={s.code}
          onCodeChange={s.setCode}
          countdownLabel={s.countdownLabel}
          remainingSeconds={s.remainingSeconds}
          resendPending={s.sendCodeMutation.isPending}
          verifyPending={s.verifyCodeMutation.isPending}
          onResend={async () => {
            await s.handleSendVerificationCode();
          }}
          onVerify={async () => {
            try {
              const ok = await s.handleVerifyCode();
              if (ok) setStep(3);
            } catch {
              /* mutation onError shows alert */
            }
          }}
          onBack={() => setStep(1)}
        />
      ) : null}

      <SignUpEmailVerificationSection
        verificationEmail={s.verificationEmail}
        onVerificationEmailChange={s.onVerificationEmailChange}
        code={s.code}
        onCodeChange={s.setCode}
        onSendCode={s.handleSendVerificationCode}
        onVerifyCode={s.handleVerifyCode}
        sendPending={s.sendCodeMutation.isPending}
        verifyPending={s.verifyCodeMutation.isPending}
        isEmailVerified={s.isEmailVerified}
        remainingSeconds={s.remainingSeconds}
        countdownLabel={s.countdownLabel}
      />
    </AuthPageLayout>
  );
};

export default SignUp;
