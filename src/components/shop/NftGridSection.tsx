import type { NftGoodsItem } from "../../apis/blockchain/blockchain";
import NftBuildingCard from "./NftBuildingCard";

type NftGridSectionProps = {
  title: string;
  items: NftGoodsItem[];
  onItemClick: (item: NftGoodsItem) => void;
  badgeText?: string;
  emptyMessage?: string;
  showComingSoonPlaceholder?: boolean;
};

export default function NftGridSection({
  title,
  items,
  onItemClick,
  badgeText,
  emptyMessage,
  showComingSoonPlaceholder = false,
}: NftGridSectionProps) {
  return (
    <section>
      <p className="mb-3 text-[12px] font-bold tracking-widest text-[#78716D]">{title}</p>

      {items.length === 0 && emptyMessage ? (
        <p className="text-[12px] text-[#78716D]">{emptyMessage}</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {items.map((nft) => (
            <NftBuildingCard
              key={nft.index}
              onClick={() => onItemClick(nft)}
              item={nft}
              badgeText={badgeText}
            />
          ))}

          {showComingSoonPlaceholder && items.length % 2 !== 0 && (
            <div className="aspect-square flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200">
              <p className="text-xs text-slate-300">Coming soon</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
