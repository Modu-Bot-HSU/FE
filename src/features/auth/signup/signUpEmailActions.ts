import type { UseMutationResult } from "@tanstack/react-query";
import { ensureSignupAccessToken } from "./ensureSignupAccessToken";
import { getErrorMessage, isHansungEmail } from "./signUpHelpers";

type SendMut = UseMutationResult<unknown, unknown, string, unknown>;
type VerifyMut = UseMutationResult<unknown, unknown, { email: string; code: string }, unknown>;

export async function runSendUniversityCode(
  email: string,
  name: string,
  signupWalletAddress: string,
  sendCodeMutation: SendMut,
): Promise<boolean> {
  const confirm = email.trim();
  if (!name.trim()) {
    alert("이름을 입력해주세요.");
    return false;
  }
  if (!isHansungEmail(confirm)) {
    alert("한성대학교 이메일(@hansung.ac.kr)만 사용 가능합니다.");
    return false;
  }
  if (sendCodeMutation.isPending) return false;

  try {
    const ok = await ensureSignupAccessToken({
      forceRefresh: true,
      signupWalletAddress,
    });
    if (!ok) return false;
  } catch (error: unknown) {
    alert(`인증 전 로그인 처리 실패: ${getErrorMessage(error)}`);
    return false;
  }

  await sendCodeMutation.mutateAsync(confirm);
  return true;
}

export async function runVerifyEmailCode(
  email: string,
  code: string,
  remainingSeconds: number,
  signupWalletAddress: string,
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

  try {
    const ok = await ensureSignupAccessToken({
      forceRefresh: true,
      signupWalletAddress,
    });
    if (!ok) return false;
  } catch (error: unknown) {
    alert(`인증 전 로그인 처리 실패: ${getErrorMessage(error)}`);
    return false;
  }

  await verifyCodeMutation.mutateAsync({ email: confirm, code });
  return true;
}
