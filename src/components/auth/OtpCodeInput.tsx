import { useRef } from "react";
import { LOGIN_UI } from "./authTheme";

type Props = {
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
};

const LENGTH = 6;

export default function OtpCodeInput({ value, onChange, disabled }: Props) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInput = (i: number, raw: string) => {
    const d = raw.replace(/\D/g, "").slice(-1);
    if (!d) return;
    const next = (value.slice(0, i) + d + value.slice(i + 1)).slice(0, LENGTH);
    onChange(next);
    if (i < LENGTH - 1) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Backspace") return;
    if (value[i]) {
      onChange(value.slice(0, i) + value.slice(i + 1));
    } else if (i > 0) {
      onChange(value.slice(0, i - 1) + value.slice(i));
      inputs.current[i - 1]?.focus();
    }
  };

  const onPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
    onChange(pasted);
  };

  return (
    <div className="flex justify-between gap-2" onPaste={onPaste}>
      {Array.from({ length: LENGTH }, (_, i) => {
        const filled = Boolean(value[i]);
        return (
          <input
            key={i}
            ref={(el) => {
              inputs.current[i] = el;
            }}
            inputMode="numeric"
            maxLength={1}
            disabled={disabled}
            value={value[i] ?? ""}
            onChange={(e) => handleInput(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="h-12 w-11 rounded-[10px] border-2 text-center text-lg font-semibold outline-none focus:ring-2 focus:ring-orange-200/80"
            style={{
              borderColor: filled ? LOGIN_UI.heading : LOGIN_UI.border,
              color: LOGIN_UI.heading,
            }}
          />
        );
      })}
    </div>
  );
}
