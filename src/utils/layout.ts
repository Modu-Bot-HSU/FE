export function shouldHideHeader(pathname: string) {
  if (pathname === "/") return true;
  if (pathname.startsWith("/login")) return true;
  if (pathname.startsWith("/auth")) return true;
  if (pathname.startsWith("/embed")) return true;
  if (pathname.startsWith("/campus")) return true;
  if (pathname.startsWith("/profile")) return true;
  return false;
}

export const SIDEBAR_BUTTON_SAFE_TOP_CLASS = "pt-24";

/** /chat — 햄버거 메뉴와 첫 줄이 겹치지 않도록 */
export const CHAT_SAFE_TOP_CLASS = "pt-28";

