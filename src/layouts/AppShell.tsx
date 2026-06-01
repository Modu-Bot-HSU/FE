import { Outlet } from "react-router-dom";
import MobileLayout from "../components/common/MobileLayout";

/** 모든 라우트를 모바일 레이아웃으로 감쌈 */
export default function AppShell() {
  return (
    <MobileLayout>
      <Outlet />
    </MobileLayout>
  );
}
