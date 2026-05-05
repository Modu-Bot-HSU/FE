import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getHsBalance,
  getNftGoods,
  type NftGoodsItem,
} from "../../apis/blockchain/blockchain";

export default function NftCollectionPage() {
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

  // 판매된 항목은 "소유 중"으로 표시 (실제로는 owner 필드 기준 처리)
  const owned = goods.filter((g) => g.isSold);
  const available = goods.filter((g) => !g.isSold);

  return (
    <div className="flex h-full flex-col bg-white">
      {/* 헤더 */}
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

      {/* 본문 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-slate-400">불러오는 중...</p>
          </div>
        ) : (
          <>
            {/* MY BUILDINGS */}
            <section>
              <p className="text-xs font-semibold tracking-widest text-slate-400 mb-3">
                MY BUILDINGS
              </p>
              {owned.length === 0 ? (
                <p className="text-sm text-slate-400">소유한 NFT가 없습니다.</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {owned.map((nft) => (
                    <button
                      key={nft.index}
                      onClick={() => navigate(`/campus/${nft.index}`)}
                      className="relative rounded-xl overflow-hidden border border-slate-200 text-left"
                    >
                      <div className="aspect-square bg-slate-100">
                        {nft.imageUrl && (
                          <img
                            src={nft.imageUrl}
                            alt={nft.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="absolute top-2 left-2">
                        <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-white">
                          Owned
                        </span>
                      </div>
                      <div className="p-2">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {nft.name}
                        </p>
                        <p className="text-xs text-slate-400">{nft.price} tokens</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* AVAILABLE */}
            <section>
              <p className="text-xs font-semibold tracking-widest text-slate-400 mb-3">
                AVAILABLE
              </p>
              <div className="grid grid-cols-2 gap-3">
                {available.map((nft) => (
                  <button
                    key={nft.index}
                    onClick={() => navigate(`/campus/${nft.index}`)}
                    className="rounded-xl overflow-hidden border border-slate-200 text-left"
                  >
                    <div className="aspect-square bg-slate-100">
                      {nft.imageUrl && (
                        <img
                          src={nft.imageUrl}
                          alt={nft.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-2">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {nft.name}
                      </p>
                      <p className="text-xs text-slate-500">{nft.price} tokens</p>
                    </div>
                  </button>
                ))}

                {/* Coming soon 빈 슬롯 */}
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
