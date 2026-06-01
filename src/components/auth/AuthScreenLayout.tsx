import type { ReactNode } from "react";
import { APP_BACKGROUND } from "../../utils/layout";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function AuthScreenLayout({ children, className = "" }: Props) {
  return (
    <div
      className={`flex min-h-full flex-col px-6 pb-8 pt-10 ${className}`}
      style={{ backgroundColor: APP_BACKGROUND }}
    >
      {children}
    </div>
  );
}
