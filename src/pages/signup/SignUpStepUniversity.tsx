import { useState } from "react";
import AuthBackLink from "../../components/auth/AuthBackLink";
import AuthButton from "../../components/auth/AuthButton";
import AuthLabeledInput from "../../components/auth/AuthLabeledInput";
import SignUpProgressBar from "../../components/auth/SignUpProgressBar";
import { LOGIN_UI } from "../../components/auth/authTheme";
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
    <div className="flex min-h-0 flex-1 flex-col">
      <SignUpProgressBar step={1} />

      <header className="mb-8">
        <h1
          className="font-serif text-[28px] font-bold leading-tight tracking-tight text-[#0F253E]"
        >
          Create your account
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed" style={{ color: LOGIN_UI.body }}>
          Step 1 of 3 — Verify your university
        </p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <AuthLabeledInput
          loginTone
          label="UNIVERSITY EMAIL"
          name="email"
          type="email"
          placeholder="you@university.edu"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          hint="Must be an official university email address"
          error={emailErr || undefined}
        />
        <AuthLabeledInput
          loginTone
          label="FULL NAME"
          name="name"
          placeholder="Your name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          error={nameErr || undefined}
        />

        <div className="mt-auto pt-6">
          <AuthButton
            variant="primary"
            style={{ backgroundColor: LOGIN_UI.primary }}
            onClick={() => void submit()}
            disabled={sendPending}
          >
            {sendPending ? "Sending…" : "Send verification code"}
          </AuthButton>
          <AuthBackLink onClick={onBack} />
        </div>
      </div>
    </div>
  );
}
