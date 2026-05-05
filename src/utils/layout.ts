export function shouldHideHeader(pathname: string) {
  if (pathname === "/") return true;
  if (pathname.startsWith("/login")) return true;
  if (pathname.startsWith("/auth")) return true;
  if (pathname.startsWith("/embed")) return true;
  if (pathname.startsWith("/campus")) return true;
  return false;
}

