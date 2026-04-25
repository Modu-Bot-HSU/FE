import SignUpEmailVerificationSection from "./SignUpEmailVerificationSection";
import SignUpRegisterSection from "./SignUpRegisterSection";
import { useSignUp } from "./useSignUp";

const SignUp = () => {
  const s = useSignUp();

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen p-4">
      <div className="text-xl font-bold text-gray-500 mb-2">회원가입</div>

      <SignUpRegisterSection
        email={s.email}
        onEmailChange={s.onEmailChange}
        walletAddress={s.walletAddress}
        onWalletChange={s.setWalletAddress}
        name={s.name}
        onNameChange={s.setName}
        onSubmit={s.handleComplete}
        isPending={s.isPending}
        isSignUpCompleted={s.isSignUpCompleted}
      />

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
    </div>
  );
};

export default SignUp;
