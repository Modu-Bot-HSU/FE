import { useContext, useEffect, useState } from "react";
import { SidebarContext } from "../../contexts/SidebarContext";
import type { NftGoodsItem } from "../../apis/blockchain/blockchain";
import AnimatedBottomSheet from "../common/AnimatedBottomSheet";
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

const formatShort = (value: unknown, fallback = "-") => {
  if (value === null || value === undefined) return fallback;

  const text =
    typeof value === "string"
      ? value
      : typeof value === "number" || typeof value === "bigint" || typeof value === "boolean"
        ? String(value)
        : null;

  if (!text) return fallback;
  if (text.length <= 14) return text;
  return `${text.slice(0, 6)}...${text.slice(-4)}`;
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
  const [displayedItem, setDisplayedItem] = useState<NftGoodsItem | null>(item);

  useEffect(() => {
    if (item) {
      setDisplayedItem(item);
    }
  }, [item]);

  useEffect(() => {
    if (displayedItem && sidebarContext?.open) {
      onClose();
    }
  }, [sidebarContext?.open, displayedItem, onClose]);

  const open = Boolean(item);
  const currentItem = displayedItem ?? item;
  if (!currentItem && !open) return null;

  const isSold = currentItem?.isSold ?? false;
  const productHash = isSold ? currentItem?.txHash ?? null : null;
  const ownerHash = isSold ? currentItem?.owner ?? null : null;
  const numericBalance = Number(balance);
  const numericPrice = Number(currentItem?.price ?? 0);
  const isInsufficientBalance =
    Number.isFinite(numericBalance) &&
    Number.isFinite(numericPrice) &&
    numericBalance < numericPrice;

  return (
    <AnimatedBottomSheet
      open={open}
      onBackdropClick={onClose}
      onExited={() => setDisplayedItem(null)}
    >
        {balance !== undefined && (
          <BalancePill balance={balance} className="mb-2 ml-auto mr-4" />
        )}

        <div className="max-h-[75vh] overflow-y-auto rounded-t-3xl bg-[#F5F5F4] p-5 shadow-[0_-8px_24px_rgba(0,0,0,0.18)]">
          <span
            className="inline-flex rounded-full border border-[#A8A29F] bg-[#F5F5F4] px-2.5 py-0.5 text-[10px] font-medium text-[#44403D]"
          >
            {isSold ? "Sold Out" : "Available"}
          </span>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#10314f]">
            {currentItem?.name}
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-slate-600">
            {currentItem?.description}
          </p>

          <dl className="mt-6 space-y-2 text-[12px] text-slate-700">
            <div className="grid grid-cols-[110px_1fr] gap-2">
              <dt className="text-slate-500">Hash</dt>
              <dd className="truncate">{formatShort(currentItem?.txHash)}</dd>
            </div>
            <div className="grid grid-cols-[110px_1fr] gap-2">
              <dt className="text-slate-500">Metadata</dt>
              <dd className="truncate">{formatShort(currentItem?.metadataUrl)}</dd>
            </div>
            <div className="grid grid-cols-[110px_1fr] gap-2">
              <dt className="text-slate-500">Owner</dt>
              <dd>{formatShort(currentItem?.name, "-")}</dd>
            </div>
            <div className="grid grid-cols-[110px_1fr] gap-2">
              <dt className="text-slate-500">Owner Hash</dt>
              <dd>{formatShort(ownerHash, "-")}</dd>
            </div>
          </dl>

          <div className="mt-8 flex items-end gap-2 text-left">
            <p className="text-4xl font-bold leading-none text-[#fc5100]">
              {currentItem?.price}
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
                : `Purchase · ${currentItem?.price ?? 0} tokens`}
          </button>

          <button
            onClick={onClose}
            className="mt-3 w-full py-2 text-[15px] text-[#78716D] hover:text-[#10314f]"
          >
            ← Go back to {closeLabel}
          </button>
        </div>
    </AnimatedBottomSheet>
  );
}