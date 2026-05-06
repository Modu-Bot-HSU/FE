import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getHsBalance,
  getNftGoods,
  purchaseNft,
  type NftGoodsItem,
} from "../../apis/blockchain/blockchain";
import CampusMapBottomSheet from "../../components/map/CampusMapBottomSheet.tsx";
import CampusScene from "../../components/map/CampusScene.tsx";

export default function MapPage() {
  const navigate = useNavigate();
  const [goods, setGoods] = useState<NftGoodsItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState("0");
  const [symbol, setSymbol] = useState("HS");
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);

  const accessToken = localStorage.getItem("accessToken") ?? undefined;

  const fetchMapData = useCallback(async () => {
    setLoading(true);

    const [goodsResult, balanceResult] = await Promise.allSettled([
      getNftGoods(accessToken),
      getHsBalance(accessToken),
    ]);

    if (goodsResult.status === "fulfilled") {
      setGoods(goodsResult.value);
    } else {
      setGoods([]);
    }

    if (balanceResult.status === "fulfilled") {
      setBalance(balanceResult.value.balance);
      setSymbol(balanceResult.value.symbol);
    }

    setLoading(false);
  }, [accessToken]);

  useEffect(() => {
    fetchMapData();
  }, [fetchMapData]);

  useEffect(() => {
    console.log("[NftMapPage] goods loaded", goods);
  }, [goods]);

  useEffect(() => {
    console.log("[NftMapPage] selectedIndex changed", selectedIndex);
  }, [selectedIndex]);

  const getItem = (index: number) => goods.find((g) => g.index === index);

  const handleMarkerClick = (index: number) => {
    console.log("[NftMapPage] handleMarkerClick", {
      index,
      item: goods.find((g) => g.index === index) ?? null,
    });
    setSelectedIndex(index);
    setPurchaseMessage(null);
  };

  const selectedItem =
    selectedIndex !== null ? (getItem(selectedIndex) ?? null) : null;

  useEffect(() => {
    console.log("[NftMapPage] selectedItem changed", selectedItem);
  }, [selectedItem]);

  const balanceText = useMemo(
    () => `Balance ${balance} ${symbol}`,
    [balance, symbol],
  );

  const closeBottomSheet = () => {
    console.log("[NftMapPage] closeBottomSheet");
    setSelectedIndex(null);
    setPurchaseMessage(null);
  };

  const handlePurchase = async () => {
    if (!selectedItem) return;

    setIsPurchasing(true);
    setPurchaseMessage(null);

    try {
      await purchaseNft({ index: selectedItem.index }, accessToken);
      setPurchaseMessage("구매 요청이 완료되었습니다.");
      await fetchMapData();
    } catch (error) {
      if (error instanceof Error && error.message) {
        setPurchaseMessage(error.message);
      } else {
        setPurchaseMessage("구매에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="relative isolate h-full overflow-hidden bg-[#95b75f]">
      <CampusScene
        goods={goods}
        selectedIndex={selectedIndex}
        onSelect={handleMarkerClick}
        loading={loading}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-44 bg-[linear-gradient(to_top,rgba(68,84,41,0.5)_0%,rgba(68,84,41,0.16)_36%,transparent_100%)]" />

      {/* 상단 액션 */}
      <div className="absolute left-4 right-4 top-3 z-40 flex items-start justify-between">
        <button
          onClick={(event) => {
            event.stopPropagation();
            navigate("/campus/collection");
          }}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 shadow"
          aria-label="컬렉션 열기"
        >
          <span className="block h-0.5 w-4 bg-slate-700" />
          <span className="absolute mt-3 block h-0.5 w-4 bg-slate-700" />
          <span className="absolute mt-6 block h-0.5 w-4 bg-slate-700" />
        </button>
      </div>

      <CampusMapBottomSheet
        item={selectedItem}
        balanceText={balanceText}
        onPurchase={handlePurchase}
        onClose={closeBottomSheet}
        isPurchasing={isPurchasing}
        purchaseMessage={purchaseMessage}
      />
    </div>
  );
}
