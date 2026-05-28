import type { InputHTMLAttributes } from "react";
import { AUTH, LOGIN_UI } from "./authTheme";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
  loginTone?: boolean;
};

export default function AuthLabeledInput({
  label,
  error,
  hint,
  loginTone = false,
  className = "",
  id,
  ...rest
}: Props) {
  const inputId = id ?? rest.name;
  const err = Boolean(error);
  const labelColor = loginTone ? LOGIN_UI.body : AUTH.label;
  const borderCol = err ? AUTH.error : loginTone ? LOGIN_UI.border : AUTH.border;

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-xs font-semibold uppercase tracking-wide"
        style={{ color: labelColor }}
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full rounded-[10px] border px-3 py-3 text-base outline-none focus:ring-2 focus:ring-orange-200/80 ${className}`}
        style={{
          borderColor: borderCol,
        }}
        aria-invalid={err}
        {...rest}
      />
      {hint && !error ? (
        <p className="mt-1.5 text-xs leading-relaxed" style={{ color: labelColor }}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="text-sm mt-1" style={{ color: AUTH.error }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
