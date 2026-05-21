import { useContext, useEffect } from "react";
import { SidebarContext } from "../../contexts/SidebarContext";
import type { NftGoodsItem } from "../../apis/blockchain/blockchain";
import BalancePill from "../common/BalancePill";

type BuildingDetailModalProps = {
  item: NftGoodsItem | null;
  balance?: number | string;
  onPurchase: () => void;
  onClose: () => void;
  isPurchasing: boolean;
  purchaseMessage: string | null;
  closeLabel?: string;
};

const formatShort = (value: string | null | undefined, fallback = "-") => {
  if (!value) return fallback;
  if (value.length <= 14) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
};

export default function BuildingDetailModal({
  item,
  balance,
  onPurchase,
  onClose,
  isPurchasing,
  purchaseMessage,
  closeLabel = "map",
}: BuildingDetailModalProps) {
  const sidebarContext = useContext(SidebarContext);

  useEffect(() => {
    if (item && sidebarContext?.open) {
      onClose();
    }
  }, [sidebarContext?.open]);

  if (!item) return null;

  const isSold = item.isSold;
  const owner = isSold ? item.owner : null;
  const txHash = isSold ? item.txHash : null;
  const numericBalance = Number(balance);
  const numericPrice = Number(item.price);
  const isInsufficientBalance =
    Number.isFinite(numericBalance) &&
    Number.isFinite(numericPrice) &&
    numericBalance < numericPrice;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[79]"
        onClick={onClose}
      />

      <div
        className="fixed inset-x-0 bottom-0 z-[80]"
        onClick={(event) => event.stopPropagation()}
      >
        {balance !== undefined && (
          <BalancePill balance={balance} className="mb-2 ml-auto mr-4" />
        )}

      <div className="max-h-[75vh] min-h-[62vh] overflow-y-auto rounded-t-3xl bg-[#F5F5F4] p-5 shadow-[0_-8px_24px_rgba(0,0,0,0.18)]">
        <span
          className="inline-flex rounded-full border border-[#A8A29F] bg-[#F5F5F4] px-2.5 py-0.5 text-[10px] font-medium text-[#44403D]"
        >
          {isSold ? "Sold Out" : "Available"}
        </span>

        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#10314f]">
          {item.name}
        </h2>
        <p className="mt-3 text-[14px] leading-relaxed text-slate-600">
          {item.description}
        </p>

        <dl className="mt-6 space-y-2 text-[12px] text-slate-700">
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

        <div className="mt-8 flex items-end gap-2 text-left">
          <p className="text-4xl font-bold leading-none text-[#fc5100]">
            {item.price}
          </p>
          <p className="text-lg font-semibold text-slate-600">tokens</p>
        </div>

        {purchaseMessage && (
          <p className="mt-4 rounded-lg bg-white/70 px-3 py-2 text-sm text-slate-700">
            {purchaseMessage}
          </p>
        )}

        {!isSold && isInsufficientBalance && (
          <p className="mt-4 text-center text-[12px] text-[#fc5100]">
            Insufficient balance · Earn more credits
          </p>
        )}

        <button
          onClick={onPurchase}
          disabled={isSold || isPurchasing || isInsufficientBalance}
          className="mt-2 w-full rounded-xl bg-[#fc5100] py-3.5 text-base font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isSold
            ? "Sold Out"
            : isPurchasing
              ? "Purchasing..."
              : `Purchase · ${item.price} tokens`}
        </button>

        <button
          onClick={onClose}
          className="mt-3 w-full py-2 text-[15px] text-[#78716D] - hover:text-[#10314f]"
        >
          ← Go back to {closeLabel}
        </button>
      </div>
    </div>
    </>
  );
}