import type { ButtonHTMLAttributes } from "react";
import { AUTH } from "./authTheme";

type Variant = "primary" | "secondary" | "ghost";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  fullWidth?: boolean;
};

export default function AuthButton({
  variant = "primary",
  fullWidth = true,
  className = "",
  disabled,
  children,
  ...rest
}: Props) {
  const base =
    "rounded-[10px] font-semibold py-3.5 px-4 transition-opacity disabled:opacity-45 disabled:cursor-not-allowed";
  const width = fullWidth ? "w-full" : "";
  const styles: Record<Variant, string> = {
    primary: "text-white",
    secondary: "border-2 bg-transparent",
    ghost: "bg-transparent text-gray-600 underline-offset-2",
  };

  const style =
    variant === "primary"
      ? { backgroundColor: AUTH.primary }
      : variant === "secondary"
        ? { borderColor: AUTH.primary, color: AUTH.primary }
        : {};

  return (
    <button
      type="button"
      disabled={disabled}
      className={`${base} ${width} ${styles[variant]} ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </button>
  );
}
