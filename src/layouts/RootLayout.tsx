import { useContext, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SidebarContext } from "../contexts/SidebarContext";
import MobileLayout from "../components/common/MobileLayout.tsx";
import HomeSidebar from "../components/chat/Sidebar.tsx";

export default function RootLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const isAuthPage = pathname.startsWith("/auth");
  const sidebarContext = useContext(SidebarContext);

  const handleSetSidebarOpen = (open: boolean) => {
    setSidebarOpen(open);
    sidebarContext?.setOpen(open);
  };

  return (
    <MobileLayout>
      {!isAuthPage && (
        <button
          type="button"
          onClick={() => handleSetSidebarOpen(true)}
          className="absolute left-5 top-6 z-[90] flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm border border-gray-100 text-[#001F3F]"
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
      {!isAuthPage && <HomeSidebar open={sidebarOpen} onClose={() => handleSetSidebarOpen(false)} />}
    </MobileLayout>  
  );
}
