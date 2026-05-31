export const alertEthereumFlowError = (error: unknown) => {
  if (error instanceof Error && error.message) {
    alert(error.message);
    return;
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: number }).code === 4001
  ) {
    alert("서명을 거부하셨습니다.");
    return;
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: number }).code === 4100
  ) {
    alert("메타마스크 계정 연결 권한이 필요합니다.");
    return;
  }
  alert("오류가 발생했습니다. 다시 시도해주세요.");
};

export const isUserRejectedEthereumAction = (error: unknown): boolean => {
  if (typeof error !== "object" || error === null) return false;

  const walletCode = "code" in error ? (error as { code?: number | string }).code : undefined;
  if (
    walletCode === 4001 ||
    walletCode === "4001" ||
    walletCode === "ACTION_REJECTED"
  ) {
    return true;
  }

  const infoErrorCode =
    "info" in error
      ? ((error as { info?: { error?: { code?: number | string } } }).info?.error?.code ?? undefined)
      : undefined;

  return infoErrorCode === 4001 || infoErrorCode === "4001";
};
