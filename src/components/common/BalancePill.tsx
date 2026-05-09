type BalancePillProps = {
  text: string;
  className?: string;
};

export default function BalancePill({ text, className = "" }: BalancePillProps) {
  return (
    <div
      className={`w-fit rounded-full border border-slate-300 bg-white/95 px-4 py-1 text-sm text-slate-700 shadow ${className}`}
    >
      {text}
    </div>
  );
}
