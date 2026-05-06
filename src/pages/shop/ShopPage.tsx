import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getHsBalance,
  getNftGoods,
  type NftGoodsItem,
} from "../../apis/blockchain/blockchain";
import NftBuildingCard from "../../components/shop/NftBuildingCard";

export default function ShopPage() {
  const navigate = useNavigate();
  const [goods, setGoods] = useState<NftGoodsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState("0");
  const [symbol, setSymbol] = useState("HS");

  const accessToken = localStorage.getItem("accessToken") ?? undefined;

  useEffect(() => {
    Promise.allSettled([getNftGoods(accessToken), getHsBalance(accessToken)])
      .then(([goodsResult, balanceResult]) => {
        if (goodsResult.status === "fulfilled") {
          setGoods(goodsResult.value);
        } else {
          setGoods([]);
        }

        if (balanceResult.status === "fulfilled") {
          setBalance(balanceResult.value.balance);
          setSymbol(balanceResult.value.symbol);
        }
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

  const owned = goods.filter((g) => g.isSold);
  const available = goods.filter((g) => !g.isSold);

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-start justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <button className="flex flex-col gap-1 p-1" onClick={() => navigate("/campus")}>
            <span className="block h-0.5 w-5 bg-slate-700" />
            <span className="block h-0.5 w-5 bg-slate-700" />
            <span className="block h-0.5 w-5 bg-slate-700" />
          </button>
          <span className="text-lg font-bold text-slate-900 leading-tight">
            Campus<br />Collection
          </span>
        </div>
        <div className="rounded-xl border border-slate-200 px-4 py-2 text-center">
          <p className="text-lg font-bold text-slate-900">{balance}</p>
          <p className="text-xs text-slate-400">{symbol}</p>
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
                      onClick={() => navigate(`/campus/${nft.index}`)}
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
                    onClick={() => navigate(`/campus/${nft.index}`)}
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
    </div>
  );
}
