import { Navigate, Outlet, useLocation } from "react-router-dom";

const AUTH_LOGIN_PATH = "/auth/login";
const DEFAULT_AUTHENTICATED_PATH = "/";

const hasAccessToken = () => {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("accessToken");
  return typeof token === "string" && token.length > 0;
};

export function ProtectedRoute() {
  const location = useLocation();

  if (!hasAccessToken()) {
    return <Navigate to={AUTH_LOGIN_PATH} replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export function PublicOnlyRoute() {
  if (hasAccessToken()) {
    return <Navigate to={DEFAULT_AUTHENTICATED_PATH} replace />;
  }

  return <Outlet />;
}
