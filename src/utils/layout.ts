export function shouldHideHeader(pathname: string) {
  if (pathname === "/") return true;
  if (pathname.startsWith("/login")) return true;
  if (pathname.startsWith("/auth")) return true;
  if (pathname.startsWith("/embed")) return true;
  if (pathname.startsWith("/campus")) return true;
  if (pathname.startsWith("/profile")) return true;
  return false;
}

/** 앱 전역 배경 (모바일 프레임 포함) */
export const APP_BACKGROUND = "#F5F5F5";

/** 모바일 화면 비율 — 가로:세로 = 9:20 */
export const MOBILE_ASPECT_RATIO = "9 / 20";

/** 9:20 기준 참조 너비 (데스크톱 프레임 상한) */
export const MOBILE_FRAME_MAX_WIDTH_PX = 430;

export const SIDEBAR_BUTTON_SAFE_TOP_CLASS = "pt-24";

/** /chat — 햄버거 메뉴와 첫 줄이 겹치지 않도록 */
export const CHAT_SAFE_TOP_CLASS = "pt-28";