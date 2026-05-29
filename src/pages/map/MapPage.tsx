import { useCallback, useEffect, useState } from "react";
import {
  getHsBalance,
  getNftGoods,
  purchaseNft,
  type NftGoodsItem,
} from "../../apis/blockchain/blockchain";
import BuildingDetailModal from "../../components/map/BuildingDetailModal.tsx";
import CampusScene from "../../components/map/CampusScene.tsx";

export default function MapPage() {
  const [goods, setGoods] = useState<NftGoodsItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState("0");
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
        onClear={closeBottomSheet}
        loading={loading}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-44 bg-[linear-gradient(to_top,rgba(68,84,41,0.5)_0%,rgba(68,84,41,0.16)_36%,transparent_100%)]" />

      <BuildingDetailModal
        item={selectedItem}
        balance={balance}
        onPurchase={handlePurchase}
        onClose={closeBottomSheet}
        isPurchasing={isPurchasing}
        purchaseMessage={purchaseMessage}
      />
    </div>
  );
}
