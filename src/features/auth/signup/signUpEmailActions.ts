import type { UseMutationResult } from "@tanstack/react-query";
import type { SignUpRequest } from "../../../apis/auth/auth";
import { isHansungEmail } from "./signUpHelpers";

type SendMut = UseMutationResult<unknown, unknown, SignUpRequest, unknown>;
type VerifyMut = UseMutationResult<unknown, unknown, { email: string; code: string }, unknown>;

export async function runSendUniversityCode(
  email: string,
  name: string,
  sendCodeMutation: SendMut,
): Promise<boolean> {
  const confirmEmail = email.trim();
  const confirmName = name.trim();

  if (!confirmName) {
    alert("이름을 입력해주세요.");
    return false;
  }
  if (!isHansungEmail(confirmEmail)) {
    alert("한성대학교 이메일(@hansung.ac.kr)만 사용 가능합니다.");
    return false;
  }
  if (sendCodeMutation.isPending) return false;

  await sendCodeMutation.mutateAsync({
    name: confirmName,
    email: confirmEmail,
  });
  return true;
}

export async function runVerifyEmailCode(
  email: string,
  code: string,
  remainingSeconds: number,
  verifyCodeMutation: VerifyMut,
): Promise<boolean> {
  const confirm = email.trim();

  if (!confirm) {
    alert("이메일을 입력해주세요.");
    return false;
  }
  if (remainingSeconds === 0) {
    alert("인증 시간이 만료되었습니다. 인증번호를 다시 요청해주세요.");
    return false;
  }
  if (code.length !== 6) {
    alert("6자리 인증번호를 입력해주세요.");
    return false;
  }

  await verifyCodeMutation.mutateAsync({ email: confirm, code });
  return true;
}
