import { useCallback, useEffect, useState } from "react";
import {
  ensureNftPurchaseApproval,
  getHsBalance,
  getNftGoods,
  purchaseNft,
  type NftGoodsItem,
} from "../../apis/blockchain/blockchain";
import BuildingDetailModal from "../../components/map/BuildingDetailModal.tsx";
import { AxiosError } from "axios";
import NftGridSection from "../../components/shop/NftGridSection";
import BalancePill from "../../components/common/BalancePill";
import { isUserRejectedEthereumAction } from "../../features/auth/login/ethereumErrors";

export default function ShopPage() {
  const [goods, setGoods] = useState<NftGoodsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState("0");
  const [selectedItem, setSelectedItem] = useState<NftGoodsItem | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const accessToken = localStorage.getItem("accessToken") ?? undefined;

  const fetchShopData = useCallback(() => {
    Promise.allSettled([getNftGoods(accessToken), getHsBalance(accessToken)])
      .then(([goodsResult, balanceResult]) => {
        if (goodsResult.status === "fulfilled") {
          setGoods(goodsResult.value);
        } else {
          setGoods([]);
        }

        if (balanceResult.status === "fulfilled") {
          setBalance(balanceResult.value.balance);
        }
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

  useEffect(() => {
    fetchShopData();
  }, [fetchShopData]);

  const owned = goods.filter((g) => g.isSold);
  const available = goods.filter((g) => !g.isSold);

  const handlePurchase = async () => {
    if (!selectedItem) return;

    setPurchasing(true);
    setMessage(null);

    try {
      await ensureNftPurchaseApproval(selectedItem.price);
      await purchaseNft({ index: selectedItem.index }, accessToken);
      setMessage({ ok: true, text: "구매 요청이 완료되었습니다." });
      await fetchShopData();
    } catch (err) {
      if (isUserRejectedEthereumAction(err)) {
        setMessage({
          ok: false,
          text: "MetaMask 승인/서명을 취소했습니다. 계속하려면 구매하기를 다시 눌러 진행해주세요.",
        });
        return;
      }

      const msg =
        err instanceof AxiosError
          ? (err.response?.data as { message?: string })?.message ?? err.message
          : err instanceof Error
            ? err.message
            : "구매 중 오류가 발생했습니다.";
      setMessage({ ok: false, text: msg });
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="relative flex h-full flex-col bg-[#F5F5F4]">
      <div className="flex items-start justify-end px-4 py-10">
        <BalancePill balance={balance} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-slate-400">불러오는 중...</p>
          </div>
        ) : (
          <>
            <NftGridSection
              title="MY BUILDINGS"
              items={owned}
              onItemClick={setSelectedItem}
              badgeText="Owned"
              emptyMessage="소유한 NFT가 없습니다."
              isLoading={loading}
            />

            <div className="border-t border-[#d6d3d1]" />

            <NftGridSection
              title="AVAILABLE"
              items={available}
              onItemClick={setSelectedItem}
              showComingSoonPlaceholder
              isLoading={loading}
            />
          </>
        )}
      </div>

      <BuildingDetailModal
        item={selectedItem}
        balance={balance}
        onPurchase={handlePurchase}
        onClose={() => {
          setSelectedItem(null);
          setMessage(null);
        }}
        isPurchasing={purchasing}
        purchaseMessage={message?.text ?? null}
        closeLabel="shop"
      />
    </div>
  );
}
