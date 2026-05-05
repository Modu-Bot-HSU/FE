export const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }
  return "알 수 없는 오류";
};

export const formatCountdown = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remain = seconds % 60;
  return `${minutes}:${String(remain).padStart(2, "0")}`;
};

export const isHansungEmail = (email: string) => email.includes("@hansung.ac.kr");
