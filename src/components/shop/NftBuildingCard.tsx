import type { NftGoodsItem } from "../../apis/blockchain/blockchain";

type NftBuildingCardProps = {
  item: NftGoodsItem;
  badgeText?: string;
  onClick?: () => void;
};

export default function NftBuildingCard({ item, badgeText, onClick }: NftBuildingCardProps) {
  return (
    <button
      onClick={onClick}
      className="relative overflow-hidden rounded-xl border border-slate-200 bg-white text-left"
      type="button"
    >
      <div className="aspect-[6/4] bg-slate-100">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
            No image
          </div>
        )}
      </div>

      {badgeText && (
        <div className="absolute right-2 top-2 rounded-full bg-[#ff5b00] px-2.5 py-1 text-[10px] font-semibold text-white">
          {badgeText}
        </div>
      )}

      <div className="p-2.5">
        <p className="truncate text-base font-semibold leading-tight text-[#10314f]">{item.name}</p>
        <p className="mt-1 text-[20px] leading-none text-slate-500">
          <span className="font-bold text-[#fc5100] ">{item.price}</span>{" "}
          <span className="text-[12px] text-[#78716D]">tokens</span>
        </p>
      </div>
    </button>
  );
}
