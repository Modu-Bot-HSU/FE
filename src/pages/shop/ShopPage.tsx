import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getHsBalance,
  getNftGoods,
  purchaseNft,
  type NftGoodsItem,
} from "../../apis/blockchain/blockchain";
import NftBuildingCard from "../../components/shop/NftBuildingCard";
import BuildingDetailModal from "../../components/map/BuildingDetailModal.tsx";
import { AxiosError } from "axios";

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

  const balanceText = useMemo(() => `Balance ${balance} tokens`, [balance]);

  const owned = goods.filter((g) => g.isSold);
  const available = goods.filter((g) => !g.isSold);

  const handlePurchase = async () => {
    if (!selectedItem) return;

    setPurchasing(true);
    setMessage(null);

    try {
      await purchaseNft({ index: selectedItem.index }, accessToken);
      setMessage({ ok: true, text: "구매 요청이 완료되었습니다." });
      await fetchShopData();
    } catch (err) {
      const msg =
        err instanceof AxiosError
          ? (err.response?.data as { message?: string })?.message ?? err.message
          : "구매 중 오류가 발생했습니다.";
      setMessage({ ok: false, text: msg });
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="relative flex h-full flex-col bg-white">
      <div className="flex items-start justify-end px-4 py-10">
        <div className="w-fit rounded-full bg-white/95 px-4 py-1 border border-slate-300 text-sm text-slate-700 shadow">
          {balanceText}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-slate-400">불러오는 중...</p>
          </div>
        ) : (
          <>
            <section>
              <p className="text-xs font-semibold tracking-widest text-slate-400 mb-3">
                MY BUILDINGS
              </p>
              {owned.length === 0 ? (
                <p className="text-sm text-slate-400">소유한 NFT가 없습니다.</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {owned.map((nft) => (
                    <NftBuildingCard
                      key={nft.index}
                      onClick={() => setSelectedItem(nft)}
                      item={nft}
                      badgeText="Owned"
                    />
                  ))}
                </div>
              )}
            </section>

            <section>
              <p className="text-xs font-semibold tracking-widest text-slate-400 mb-3">
                AVAILABLE
              </p>
              <div className="grid grid-cols-2 gap-3">
                {available.map((nft) => (
                  <NftBuildingCard
                    key={nft.index}
                    onClick={() => setSelectedItem(nft)}
                    item={nft}
                  />
                ))}

                {available.length % 2 !== 0 && (
                  <div className="rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center aspect-square">
                    <p className="text-xs text-slate-300">Coming soon</p>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>

      <BuildingDetailModal
        item={selectedItem}
        balanceText={balanceText}
        onPurchase={handlePurchase}
        onClose={() => {
          setSelectedItem(null);
          setMessage(null);
        }}
        isPurchasing={purchasing}
        purchaseMessage={message?.text ?? null}
      />
    </div>
  );
}
