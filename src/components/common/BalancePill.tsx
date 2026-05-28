type BalancePillProps = {
  balance: number | string;
  className?: string;
};

export default function BalancePill({ balance, className = "" }: BalancePillProps) {
  return (
    <div
      className={`flex w-fit h-7 items-center justify-end gap-1.5 rounded-full border-[0.5px] border-[#A8A29F] bg-[#F5F5F4] px-3.5 py-0 ${className}`}
    >
      <span className="text-xs font-medium text-[#A8A29F]">Balance</span>
      <span className="text-xs font-medium text-black">{balance}</span>
      <span className="text-xs font-medium text-black">tokens</span>
    </div>
  );
}
