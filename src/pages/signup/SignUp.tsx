import SignUpEmailVerificationSection from "./SignUpEmailVerificationSection";
import SignUpRegisterSection from "./SignUpRegisterSection";
import { useSignUp } from "./useSignUp";
import AuthPageLayout from "../../components/common/AuthPageLayout";

const SignUp = () => {
  const s = useSignUp();

  return (
    <AuthPageLayout title="회원가입">

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
    </AuthPageLayout>
  );
};

export default SignUp;
