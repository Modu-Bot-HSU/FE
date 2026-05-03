import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthScreenLayout from "../../components/auth/AuthScreenLayout";
import SignUpStepOtp from "./SignUpStepOtp";
import SignUpStepUniversity from "./SignUpStepUniversity";
import SignUpStepWallet from "./SignUpStepWallet";
import SignUpSuccess from "./SignUpSuccess";
import { useSignUp } from "../../features/auth/signup/useSignUp";

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const s = useSignUp();

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
          sendPending={s.sendCodeMutation.isPending}
          onSendCode={async () => {
            try {
              const ok = await s.handleSendVerificationCode();
              if (ok) setStep(2);
            } catch {
              /* mutation onError shows alert */
            }
          }}
          onBack={() => navigate("/auth/login")}
        />
      ) : null}

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

      {step === 3 ? (
        <SignUpStepWallet
          email={s.email}
          walletAddress={s.walletAddress}
          onWalletChange={(e) => s.setWalletAddress(e.target.value)}
          onMetaMask={s.connectMetaMaskToForm}
          isPending={s.isPending}
          onSubmit={async () => {
            try {
              const ok = await s.handleComplete();
              if (ok) setStep(4);
            } catch {
              /* mutation onError shows alert */
            }
          }}
          onBack={() => setStep(2)}
        />
      ) : null}

      {step === 1 ? (
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/auth/login")}
            className="text-[#FF5C00] font-semibold underline"
          >
            Sign in
          </button>
        </p>
      ) : null}
    </AuthScreenLayout>
  );
};

export default SignUp;
