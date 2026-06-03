import type { ButtonHTMLAttributes, CSSProperties } from "react";
import { AUTH } from "./authTheme";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  style?: CSSProperties;
};

export default function MetaMaskAuthButton({ children, className = "", style, ...rest }: Props) {
  return (
    <button
      type="button"
      className={`flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[10px] px-4 py-3.5 font-semibold text-white ${className}`}
      style={{ backgroundColor: AUTH.navy, ...style }}
      {...rest}
    >
      <span className="text-xl leading-none" aria-hidden>
        🦊
      </span>
      {children}
    </button>
  );
}
