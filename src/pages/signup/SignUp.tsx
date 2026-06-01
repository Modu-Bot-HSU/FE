import { useEffect, useState } from "react";
import AuthScreenLayout from "../../components/auth/AuthScreenLayout";
import { useSignUp } from "../../features/auth/signup/useSignUp";
import SignUpStepUniversity from "./SignUpStepUniversity";
import SignUpStepOtp from "./SignUpStepOtp";
import SignUpStepWallet from "./SignUpStepWallet";
import SignUpSuccess from "./SignUpSuccess";

const SignUp = () => {
  const [step, setStep] = useState(1);
  const s = useSignUp();

  useEffect(() => {
    if (step === 3 && (!s.isEmailVerified || s.walletSessionSeconds <= 0)) {
      setStep(2);
    }
  }, [step, s.isEmailVerified, s.walletSessionSeconds]);

  if (step === 4 && s.successProfile) {
    return <SignUpSuccess profile={s.successProfile} />;
  }

  return (
    <AuthScreenLayout>
      {step === 1 ? (
        <SignUpStepUniversity
          email={s.email}
          name={s.name}
          onEmailChange={s.onEmailChange}
          onNameChange={s.setName}
          onSendCode={async () => {
            const ok = await s.handleSendVerificationCode();
            if (ok) setStep(2);
          }}
          sendPending={s.sendCodeMutation.isPending}
          onBack={() => setStep(1)}
        />
      ) : null}

      {step === 2 ? (
        <SignUpStepOtp
          email={s.email.trim()}
          code={s.code}
          onCodeChange={s.setCode}
          remainingSeconds={s.remainingSeconds}
          resendPending={s.sendCodeMutation.isPending}
          verifyPending={s.verifyCodeMutation.isPending}
          onResend={async () => {
            await s.handleSendVerificationCode();
          }}
          onVerify={async () => {
            const ok = await s.handleVerifyCode();
            if (ok) setStep(3);
          }}
          onBack={() => setStep(1)}
        />
      ) : null}

      {step === 3 && s.isEmailVerified && s.walletSessionSeconds > 0 ? (
        <SignUpStepWallet
          email={s.email.trim()}
          walletAddress={s.walletAddress}
          onWalletChange={(e) => s.setWalletAddress(e.target.value)}
          onMetaMask={s.connectMetaMaskToForm}
          onSubmit={async () => {
            const ok = await s.handleComplete();
            if (ok) setStep(4);
          }}
          onBack={() => setStep(2)}
          isPending={s.isPending}
        />
      ) : null}
    </AuthScreenLayout>
  );
};

export default SignUp;
