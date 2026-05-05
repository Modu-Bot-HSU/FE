import { AUTH } from "../../components/auth/authTheme";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled?: boolean;
};

export default function HomeComposer({ value, onChange, onSend, disabled }: Props) {
  return (
    <div className="shrink-0 pt-2 pb-6">
      <div className="flex items-center gap-2 rounded-2xl bg-gray-100 px-3 py-2 border border-gray-200/80">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSend();
          }}
          placeholder="Ask your campus anything..."
          disabled={disabled}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 disabled:opacity-50"
        />
        <button
          type="button"
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white disabled:opacity-40"
          style={{ backgroundColor: AUTH.primary }}
          aria-label="Send"
        >
          <span className="text-lg leading-none">↑</span>
        </button>
      </div>
    </div>
  );
}
