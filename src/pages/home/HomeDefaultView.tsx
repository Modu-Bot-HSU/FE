import { HOME_SUGGESTIONS } from "../../features/home/homeConstants";
import logoUrl from "../../assets/logo.svg";

type Props = {
  onPickSuggestion: (label: string) => void;
};

export default function HomeDefaultView({ onPickSuggestion }: Props) {
  return (
    <div className="flex flex-1 flex-col items-center text-center px-1 min-h-0">
      <div className="flex flex-1 flex-col items-center justify-center w-full max-w-sm">
        <img src={logoUrl} alt="ModuBot" className="w-[min(72vw,240px)] h-auto select-none" />
        <p className="text-gray-500 mt-5 text-sm leading-relaxed">
          Ask your ModuBot about anything.
        </p>
      </div>
      <div className="w-full max-w-md flex flex-col gap-2.5 pb-4">
        {HOME_SUGGESTIONS.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => onPickSuggestion(label)}
            className="rounded-full border border-gray-200 bg-white px-4 py-3 text-left text-sm text-gray-700 shadow-sm active:scale-[0.99]"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
