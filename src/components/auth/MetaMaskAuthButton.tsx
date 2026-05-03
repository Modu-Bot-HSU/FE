import type { ButtonHTMLAttributes } from "react";
import { AUTH } from "./authTheme";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export default function MetaMaskAuthButton({ children, className = "", ...rest }: Props) {
  return (
    <button
      type="button"
      className={`w-full flex items-center justify-center gap-2 rounded-[10px] py-3.5 px-4 text-white font-semibold ${className}`}
      style={{ backgroundColor: AUTH.navy }}
      {...rest}
    >
      <span className="text-xl leading-none" aria-hidden>
        🦊
      </span>
      {children}
    </button>
  );
}
