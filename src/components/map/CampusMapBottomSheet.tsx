import type { NftGoodsItem } from "../../apis/blockchain/blockchain";

type CampusMapBottomSheetProps = {
  item: NftGoodsItem | null;
  balanceText: string;
  onPurchase: () => void;
  onClose: () => void;
  isPurchasing: boolean;
  purchaseMessage: string | null;
};

const formatShort = (value: string | null | undefined, fallback = "-") => {
  if (!value) return fallback;
  if (value.length <= 14) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
};

export default function CampusMapBottomSheet({
  item,
  balanceText,
  onPurchase,
  onClose,
  isPurchasing,
  purchaseMessage,
}: CampusMapBottomSheetProps) {
  console.log("[CampusMapBottomSheet] render", { item });

  if (!item) return null;

  const isSold = item.isSold;
  const owner = isSold ? item.owner : null;
  const txHash = isSold ? item.txHash : null;

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-[80]"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="mx-auto mb-2 w-fit rounded-full bg-white/95 px-4 py-1 text-sm text-slate-700 shadow">
        {balanceText}
      </div>

      <div className="rounded-t-3xl bg-[#ececec] p-5 shadow-[0_-8px_24px_rgba(0,0,0,0.18)]">
        <span
          className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${
            isSold
              ? "border-rose-200 bg-rose-50 text-rose-600"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {isSold ? "Sold" : "Available"}
        </span>

        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-[#10314f]">
          {item.name}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          {item.description}
        </p>

        <dl className="mt-6 space-y-2 text-sm text-slate-700">
          <div className="grid grid-cols-[110px_1fr] gap-2">
            <dt className="text-slate-500">Metadata</dt>
            <dd className="truncate">{formatShort(item.metadataUrl)}</dd>
          </div>
          <div className="grid grid-cols-[110px_1fr] gap-2">
            <dt className="text-slate-500">Owner</dt>
            <dd>{formatShort(owner, "-")}</dd>
          </div>
          <div className="grid grid-cols-[110px_1fr] gap-2">
            <dt className="text-slate-500">Tx Hash</dt>
            <dd>{formatShort(txHash, "-")}</dd>
          </div>
        </dl>

        <div className="mt-8">
          <p className="text-5xl font-bold leading-none text-[#ff5b00]">
            {item.price}
          </p>
          <p className="mt-1 text-3xl font-semibold text-slate-600">tokens</p>
        </div>

        {purchaseMessage && (
          <p className="mt-4 rounded-lg bg-white/70 px-3 py-2 text-sm text-slate-700">
            {purchaseMessage}
          </p>
        )}

        <button
          onClick={onPurchase}
          disabled={isSold || isPurchasing}
          className="mt-6 w-full rounded-xl bg-[#ff5b00] py-3.5 text-lg font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isSold
            ? "Sold Out"
            : isPurchasing
              ? "Purchasing..."
              : `Purchase · ${item.price} tokens`}
        </button>

        <button
          onClick={onClose}
          className="mt-3 w-full py-2 text-lg text-slate-500"
        >
          ← Go back to map
        </button>
      </div>
    </div>
  );
}
