import type { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

const AuthPageLayout = ({ title, children }: Props) => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
    <div className="mb-2 text-xl font-bold text-gray-500">{title}</div>
    {children}
  </div>
);

export default AuthPageLayout;
