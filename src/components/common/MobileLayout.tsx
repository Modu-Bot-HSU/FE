import type { ReactNode } from "react";
import { APP_BACKGROUND } from "../../utils/layout";

type MobileLayoutProps = {
  children: ReactNode;
};

/*모바일 프레임*/
export default function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="mobile-frame-shell" style={{ backgroundColor: APP_BACKGROUND }}>
      <div className="mobile-frame relative mx-auto" style={{ backgroundColor: APP_BACKGROUND }}>
        {children}
      </div>
    </div>
  );
}
