import { Navigate, Outlet, useLocation } from "react-router-dom";

const AUTH_LOGIN_PATH = "/auth/login";

const hasValidAccessToken = () => {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("accessToken");
  if (typeof token !== "string" || token.length === 0) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp as number | undefined;
    if (exp == null) return true;
    return Date.now() / 1000 < exp;
  } catch {
    return false;
  }
};

export function ProtectedRoute() {
  const location = useLocation();

  if (!hasValidAccessToken()) {
    return <Navigate to={AUTH_LOGIN_PATH} replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export function PublicOnlyRoute() {
  if (hasValidAccessToken()) {
    return <Navigate to="/chat" replace />;
  }

  return <Outlet />;
}
