import type { ReactNode } from "react";

type Tone = "blue" | "indigo" | "green" | "orange";

type Props = {
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  tone?: Tone;
  className?: string;
  children: ReactNode;
};

const toneClassMap: Record<Tone, string> = {
  blue: "bg-blue-500 hover:bg-blue-600",
  indigo: "bg-indigo-500 hover:bg-indigo-600",
  green: "bg-green-500 hover:bg-green-600",
  orange: "bg-orange-500 hover:bg-orange-600",
};

const FormActionButton = ({
  type = "button",
  onClick,
  disabled = false,
  tone = "blue",
  className = "",
  children,
}: Props) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`${className} w-full max-w-[320px] rounded-lg py-3 font-bold text-white transition-all ${
      disabled ? "cursor-not-allowed bg-gray-400" : `${toneClassMap[tone]} active:scale-95`
    }`}
  >
    {children}
  </button>
);

export default FormActionButton;
