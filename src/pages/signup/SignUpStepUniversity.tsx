import { useState } from "react";
import AuthButton from "../../components/auth/AuthButton";
import AuthLabeledInput from "../../components/auth/AuthLabeledInput";
import ScreenTitle from "../../components/auth/ScreenTitle";
import { isHansungEmail } from "../../features/auth/signup/signUpHelpers";

type Props = {
  email: string;
  name: string;
  onEmailChange: (v: string) => void;
  onNameChange: (v: string) => void;
  onSendCode: () => Promise<void>;
  sendPending: boolean;
  onBack: () => void;
};

export default function SignUpStepUniversity({
  email,
  name,
  onEmailChange,
  onNameChange,
  onSendCode,
  sendPending,
  onBack,
}: Props) {
  const [emailErr, setEmailErr] = useState("");
  const [nameErr, setNameErr] = useState("");

  const submit = async () => {
    let ne = "";
    let ee = "";
    if (!name.trim()) ne = "이름을 입력해주세요.";
    if (!email.trim()) ee = "학교 이메일을 입력해주세요.";
    else if (!isHansungEmail(email.trim())) ee = "한성대 이메일(@hansung.ac.kr)만 사용할 수 있습니다.";
    setNameErr(ne);
    setEmailErr(ee);
    if (ne || ee) return;
    await onSendCode();
  };

  return (
    <div className="flex flex-col flex-1">
      <button type="button" onClick={onBack} className="text-sm text-gray-500 mb-4 self-start">
        ← Back
      </button>
      <ScreenTitle
        title="Create your account"
        subtitle="Step 1 of 3 — Verify your university (Hansung @hansung.ac.kr)"
      />
      <div className="flex flex-col gap-4 flex-1">
        <AuthLabeledInput
          label="UNIVERSITY EMAIL"
          name="email"
          type="email"
          placeholder="you@hansung.ac.kr"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          error={emailErr || undefined}
        />
        <AuthLabeledInput
          label="FULL NAME"
          name="name"
          placeholder="홍길동"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          error={nameErr || undefined}
        />
        <div className="mt-auto pt-6">
          <AuthButton variant="primary" onClick={submit} disabled={sendPending}>
            {sendPending ? "Sending…" : "Send verification code"}
          </AuthButton>
        </div>
      </div>
    </div>
  );
}
