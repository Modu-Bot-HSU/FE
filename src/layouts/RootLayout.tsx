import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import MobileLayout from "../components/common/MobileLayout.tsx";
import HomeSidebar from "../components/chat/Sidebar.tsx";

export default function RootLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const isAuthPage = pathname.startsWith("/auth");

  return (
    <MobileLayout>
      {!isAuthPage && (
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="absolute left-5 top-6 z-30 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm border border-gray-100 text-[#001F3F]"
          aria-label="Open menu"
        >
          <span className="flex flex-col gap-1">
            <span className="block h-0.5 w-6 rounded-full bg-current" />
            <span className="block h-0.5 w-4 rounded-full bg-current" />
            <span className="block h-0.5 w-6 rounded-full bg-current" />
          </span>
        </button>
      )}
      <Outlet />
      {!isAuthPage && <HomeSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />}
    </MobileLayout>  
  );
}
