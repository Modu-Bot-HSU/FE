import type { ReactNode } from "react";
import { LOGIN_UI } from "./authTheme";

type Props = {
  title: string;
  subtitle?: ReactNode;
  /** 로그인 피그마: 산세리프 + #0F253E / #717171 */
  variant?: "default" | "login";
};

export default function ScreenTitle({ title, subtitle, variant = "default" }: Props) {
  const isLogin = variant === "login";

  return (
    <header className="mb-8">
      <h1
        className={
          isLogin
            ? "text-[26px] font-bold leading-tight tracking-tight sm:text-[28px]"
            : "text-2xl font-bold text-gray-900"
        }
        style={isLogin ? { color: LOGIN_UI.heading } : undefined}
      >
        {title}
      </h1>
      {subtitle != null && subtitle !== "" ? (
        <div
          className={`mt-3 leading-relaxed ${isLogin ? "text-[15px]" : "mt-2 text-sm text-gray-500"}`}
          style={isLogin ? { color: LOGIN_UI.body } : undefined}
        >
          {subtitle}
        </div>
      ) : null}
    </header>
  );
}
