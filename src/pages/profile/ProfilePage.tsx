import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getHsBalance,
  getNftGoods,
  type NftGoodsItem,
} from "../../apis/blockchain/blockchain";
import { useAuthStore } from "../../store/useAuthStore";
import { SIDEBAR_BUTTON_SAFE_TOP_CLASS } from "../../utils/layout";
import NftGridSection from "../../components/shop/NftGridSection";
import BuildingDetailModal from "../../components/map/BuildingDetailModal";

type ProfileMockData = {
  walletType: string;
  dailyQ: {
    received: number;
    pending: number;
    notCredited: number;
  };
};

const profileMock: ProfileMockData = {
  walletType: "MetaMask",
  dailyQ: {
    received: 12,
    pending: 4,
    notCredited: 2,
  },
};



export default function ProfilePage() {
  const navigate = useNavigate();
  const tempUser = useAuthStore((state) => state.tempUser);
  const [balance, setBalance] = useState("12");
  const [ownedNfts, setOwnedNfts] = useState<NftGoodsItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<NftGoodsItem | null>(null);
  const [loading, setLoading] = useState(true);

  const accessToken = localStorage.getItem("accessToken") ?? undefined;

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([getHsBalance(accessToken), getNftGoods(accessToken)])
      .then(([balanceResult, goodsResult]) => {
        if (balanceResult.status === "fulfilled") {
          setBalance(balanceResult.value.balance);
        }

        if (goodsResult.status === "fulfilled") {
          setOwnedNfts(goodsResult.value.filter((item) => item.isSold));
        } else {
          setOwnedNfts([]);
        }
      })
      .catch(() => {
        setOwnedNfts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [accessToken]);

  const profile = useMemo(
    () => ({
      name: tempUser?.name || "Sean Kim",
      email: tempUser?.email || "sean@university.edu",
      walletAddress: tempUser?.walletAddress || "0x4a3b...f3b1",
      ...profileMock,
    }),
    [tempUser],
  );

  const myBuildings = ownedNfts.length > 0 ? ownedNfts : [];

  const initials = profile.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={`relative min-h-full bg-[#f3f3f3] px-4 pb-6 ${SIDEBAR_BUTTON_SAFE_TOP_CLASS}`}>
      
      <section className="mt-6">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-[0.5px] border-[#A8A29F] bg-[#D6D3D1] text-[34px] font-bold text-[#A8A29F]">
            {initials}
          </div>

          <div>
            <h1 className="text-[28px] font-semibold leading-none text-[#002A47]">{profile.name}</h1>
            <p className="mt-2 text-[14px] text-[#A8A29F]">{profile.email}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-[#c9c9c9] bg-[#f4f4f4] px-3 py-3 text-center">
            <p className="text-[24px] font-semibold leading-none text-[#002A47]">{balance}</p>
            <p className="mt-1 text-[12px] text-[#78716D]">Tokens Balance</p>
          </div>
          <div className="rounded-xl border border-[#c9c9c9] bg-[#f4f4f4] px-3 py-3 text-center">
            <p className="text-[24px] font-semibold leading-none text-[#002A47]">{myBuildings.length}</p>
            <p className="mt-1 text-[12px] text-[#78716D]">My Buildings</p>
          </div>
        </div>
      </section>

      <section className="mt-6 border-t border-[#dfdfdf] pt-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[12px] font-bold tracking-wide text-[#78716D]">DAILY Q HISTORY</h2>
          {/* daily q history로 이동 */}
          <button type="button" onClick={() => navigate("/daily-q/history")} className="text-[12px] font-medium text-[#002A47]">View History →</button>
        </div>

        <div className="flex rounded-xl border border-[#c9c9c9] bg-[#f4f4f4]">
          <div className="flex-1 py-3 text-center">
            <p className="text-[24px] font-bold leading-none text-[#2D7A2D]">{profile.dailyQ.received}</p>
            <p className="mt-1 text-[12px] text-[#2D7A2D]">Received</p>
          </div>
          <div className="my-3 w-px bg-[#d5d5d5]" />
          <div className="flex-1 py-3 text-center">
            <p className="text-[24px] font-bold leading-none text-[#B35900]">{profile.dailyQ.pending}</p>
            <p className="mt-1 text-[12px] text-[#B35900]">Pending</p>
          </div>
          <div className="my-3 w-px bg-[#d5d5d5]" />
          <div className="flex-1 py-3 text-center">
            <p className="text-[24px] font-bold leading-none text-[#C0392B]">{profile.dailyQ.notCredited}</p>
            <p className="mt-1 text-[12px] text-[#C0392B]">Not Credited</p>
          </div>
        </div>
      </section>

      <section className="mt-6 border-t border-[#dfdfdf] pt-4">
        <NftGridSection
          title="MY BUILDINGS"
          items={myBuildings.filter((g) => g.isSold)}
          onItemClick={setSelectedItem}
          badgeText="Owned"
          emptyMessage="소유한 건물이 없습니다."
          isLoading={loading}
        />
      </section>

      <BuildingDetailModal
        item={selectedItem}
        onPurchase={() => {}}
        onClose={() => setSelectedItem(null)}
        isPurchasing={false}
        purchaseMessage={null}
        closeLabel="profile"
      />

      <section className="mt-6 border-t border-[#dfdfdf] pt-4">
        <h2 className="mb-3 text-[12px] font-bold tracking-wide text-[#78716D]">ACCOUNT</h2>
        <div className="overflow-hidden rounded-xl border border-[#A8A29F] bg-[#f4f4f4]">
          <div className="grid grid-cols-[120px_1fr] border-[0.5px] border-[#d7d7d7] px-4 py-3 text-[14px]">
            <p className="font-medium text-[#002A47]">Email</p>
            <p className="truncate text-right text-[#78716D]">{profile.email}</p>
          </div>
          <div className="grid grid-cols-[120px_1fr] border-b border-[#D6D3D1] px-4 py-3 text-[14px]">
            <p className="font-medium text-[#002A47]">Wallet</p>
            <p className="truncate text-right text-[#78716D]">{profile.walletAddress}</p>
          </div>
          <div className="grid grid-cols-[120px_1fr] border-b border-[#D6D3D1] px-4 py-3 text-[14px]">
            <p className="font-medium text-[#002A47]">Wallet Type</p>
            <p className="truncate text-right text-[#78716D]">{profile.walletType}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
