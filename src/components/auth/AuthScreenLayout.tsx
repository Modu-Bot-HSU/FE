import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function AuthScreenLayout({ children, className = "" }: Props) {
  return (
    <div
      className={`min-h-[calc(100vh-0px)] flex flex-col px-5 pt-10 pb-8 bg-white ${className}`}
    >
      {children}
    </div>
  );
}
