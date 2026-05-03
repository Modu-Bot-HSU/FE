import type { InputHTMLAttributes } from "react";
import { AUTH } from "./authTheme";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export default function AuthLabeledInput({
  label,
  error,
  className = "",
  id,
  ...rest
}: Props) {
  const inputId = id ?? rest.name;
  const err = Boolean(error);

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="block text-xs font-semibold tracking-wide mb-1.5"
        style={{ color: AUTH.label }}
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full rounded-[10px] border px-3 py-3 text-base outline-none focus:ring-2 focus:ring-orange-200 ${className}`}
        style={{
          borderColor: err ? AUTH.error : AUTH.border,
        }}
        aria-invalid={err}
        {...rest}
      />
      {error ? (
        <p className="text-sm mt-1" style={{ color: AUTH.error }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
