import { Outlet, useLocation } from "react-router-dom";
import { shouldHideHeader } from "../utils/layout";

import Header from "../components/common/header.tsx";
import MobileLayout from "../components/common/MobileLayout.tsx";

export default function RootLayout() {
  const { pathname } = useLocation();
  const showHeader = !shouldHideHeader(pathname);

  return (
    <MobileLayout>
      {showHeader && <Header isLogin={true} />}
      <Outlet />
    </MobileLayout>
  );
}
