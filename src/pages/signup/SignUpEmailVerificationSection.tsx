import CustomInput from "../../components/common/Input";

type Props = {
  verificationEmail: string;
  onVerificationEmailChange: (value: string) => void;
  code: string;
  onCodeChange: (value: string) => void;
  onSendCode: () => void;
  onVerifyCode: () => void;
  sendPending: boolean;
  verifyPending: boolean;
  isEmailVerified: boolean;
  remainingSeconds: number;
  countdownLabel: string;
};

const SignUpEmailVerificationSection = ({
  verificationEmail,
  onVerificationEmailChange,
  code,
  onCodeChange,
  onSendCode,
  onVerifyCode,
  sendPending,
  verifyPending,
  isEmailVerified,
  remainingSeconds,
  countdownLabel,
}: Props) => (
  <div className="w-full max-w-[320px] border-t border-gray-200 pt-4 mt-2">
    <p className="text-sm text-gray-500 mb-2">2단계: 이메일 인증 (회원가입 후 별도 진행)</p>

    <p className="text-xs text-gray-400 mb-1">
      가입 시 사용한 한성대 이메일을 아래에 다시 입력한 뒤 인증번호를 요청해주세요.
    </p>
    <CustomInput
      name="verificationEmail"
      placeholder="가입한 한성대 이메일 (@hansung.ac.kr)"
      value={verificationEmail}
      onChange={(e) => onVerificationEmailChange(e.target.value)}
    />

    <button
      type="button"
      onClick={onSendCode}
      disabled={sendPending}
      className={`mt-3 w-full max-w-[320px] py-2 rounded-lg text-white font-bold transition-all ${
        sendPending
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-indigo-500 hover:bg-indigo-600 active:scale-95"
      }`}
    >
      {sendPending ? "전송 중..." : "인증번호 전송"}
    </button>

    <CustomInput
      name="code"
      placeholder="인증번호 6자리"
      value={code}
      onChange={(e) => onCodeChange(e.target.value)}
      className="mt-3"
    />
    <button
      type="button"
      onClick={onVerifyCode}
      disabled={verifyPending || isEmailVerified}
      className={`mt-3 w-full max-w-[320px] py-2 rounded-lg text-white font-bold transition-all ${
        verifyPending || isEmailVerified
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-green-500 hover:bg-green-600 active:scale-95"
      }`}
    >
      {isEmailVerified
        ? "이메일 인증 완료"
        : verifyPending
          ? "확인 중..."
          : "인증번호 확인"}
    </button>

    {remainingSeconds > 0 && !isEmailVerified && (
      <p className="text-sm text-gray-500 mt-2">인증 제한 시간: {countdownLabel}</p>
    )}
  </div>
);

export default SignUpEmailVerificationSection;
