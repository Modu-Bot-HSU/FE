import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getHsBalance,
  getNftGoods,
  purchaseNft,
  type NftGoodsItem,
} from "../../apis/blockchain/blockchain";
import CampusMapBottomSheet from "./components/CampusMapBottomSheet";
import MapMarker from "./components/MapMarker";

type MarkerConfig = {
  index: number;
  fallbackLabel: string;
  x: string;
  y: string;
};

const MAP_MARKERS: MarkerConfig[] = [
  { index: 0, fallbackLabel: "Main Library", x: "77%", y: "16%" },
  { index: 1, fallbackLabel: "Science Hall", x: "70%", y: "54%" },
  { index: 2, fallbackLabel: "Student Union", x: "24%", y: "88%" },
  { index: 3, fallbackLabel: "Main Building", x: "30%", y: "44%" },
];

export default function NftMapPage() {
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

  const getItem = (index: number) => goods.find((g) => g.index === index);

  const handleMarkerClick = (index: number) => {
    setSelectedIndex(index);
    setPurchaseMessage(null);
  };

  const selectedItem = selectedIndex !== null ? getItem(selectedIndex) ?? null : null;

  const balanceText = useMemo(
    () => `Balance ${balance} ${symbol}`,
    [balance, symbol],
  );

  const closeBottomSheet = () => {
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
    <div className="relative h-full overflow-hidden bg-[#95b75f]" onClick={closeBottomSheet}>
      {/* 임시 목맵 배경 (실제 3D 이미지 전달 시 이 레이어를 이미지로 교체) */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_30%_20%,#a6ca67_0%,#8eae52_45%,#7da348_100%)]" />
      <div className="absolute -bottom-6 -left-8 h-40 w-64 rotate-3 rounded-[32px] bg-[#7c9f45]/70" />
      <div className="absolute top-[24%] left-[8%] h-28 w-56 -rotate-6 rounded-[24px] bg-[#caa78a]/80 shadow-[0_16px_28px_rgba(0,0,0,0.18)]" />
      <div className="absolute top-[37%] right-[7%] h-44 w-52 rotate-6 rounded-[26px] bg-[#d6b89c]/80 shadow-[0_20px_36px_rgba(0,0,0,0.2)]" />
      <div className="absolute bottom-[20%] left-[6%] h-24 w-72 -rotate-2 rounded-[18px] bg-[#d9d2c9]/85 shadow-[0_14px_24px_rgba(0,0,0,0.16)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_top,#868177_0%,transparent_100%)]" />

      {/* 상단 액션 */}
      <div className="absolute left-4 right-4 top-3 z-20 flex items-start justify-between">
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

        <button
          onClick={(event) => {
            event.stopPropagation();
            navigate("/campus/collection");
          }}
          className="rounded-full bg-black/35 px-3 py-1.5 text-xs font-medium text-white backdrop-blur"
        >
          Collection
        </button>
      </div>

      {/* 건물 마커 */}
      {MAP_MARKERS.map((marker) => {
        const item = getItem(marker.index);
        const label = loading ? "..." : item?.name ?? marker.fallbackLabel;
        const isSelected = selectedIndex === marker.index;

        return (
          <MapMarker
            key={marker.index}
            label={label}
            x={marker.x}
            y={marker.y}
            isSold={item?.isSold ?? false}
            isSelected={isSelected}
            onClick={() => handleMarkerClick(marker.index)}
          />
        );
      })}

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
