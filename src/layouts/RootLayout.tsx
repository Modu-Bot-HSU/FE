import { Outlet, useLocation } from "react-router-dom";
import { shouldHideHeader } from "../utils/layout";
import Header from "../components/common/Header.tsx";

export default function RootLayout() {
  const { pathname } = useLocation();
  const showHeader = !shouldHideHeader(pathname);

  return (
    <div className="min-h-screen ">
      {showHeader && (
        <div className="flex justify-center">
          <Header isLogin={true} />
        </div>
      )}
      <Outlet />
    </div>
  );
}
