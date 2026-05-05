import type { ReactNode } from "react";

type MobileLayoutProps = {
  children: ReactNode;
};

export default function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="relative w-full max-w-[430px] min-h-screen bg-white overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
