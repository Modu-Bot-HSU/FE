import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getHsBalance,
  getNftGoods,
  type NftGoodsItem,
} from "../../apis/blockchain/blockchain";
import { useAuthStore } from "../../store/useAuthStore";
import { APP_BACKGROUND, SIDEBAR_BUTTON_SAFE_TOP_CLASS } from "../../utils/layout";
import NftGridSection from "../../components/shop/NftGridSection";
import BuildingDetailModal from "../../components/map/BuildingDetailModal";
import { fetchMyKnowledgeSubmissions } from "../../apis/knowledge/knowledge";
import { countCreateSubmissionStats } from "../../features/knowledge/knowledgeSubmissionStats";

type ProfileDailyQData = {
  walletType: string;
  dailyQ: {
    received: number;
    pending: number;
    notCredited: number;
  };
};

const defaultDailyQ: ProfileDailyQData = {
  walletType: "MetaMask",
  dailyQ: {
    received: 0,
    pending: 0,
    notCredited: 0,
  },
};



export default function ProfilePage() {
  const navigate = useNavigate();
  const tempUser = useAuthStore((state) => state.tempUser);
  const [balance, setBalance] = useState("12");
  const [ownedNfts, setOwnedNfts] = useState<NftGoodsItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<NftGoodsItem | null>(null);
  const [dailyQStats, setDailyQStats] = useState(defaultDailyQ.dailyQ);

  const accessToken = localStorage.getItem("accessToken") ?? undefined;

  useEffect(() => {
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
      });
  }, [accessToken]);

  useEffect(() => {
    fetchMyKnowledgeSubmissions()
      .then((items) => setDailyQStats(countCreateSubmissionStats(items)))
      .catch(() => setDailyQStats(defaultDailyQ.dailyQ));
  }, []);

  const profile = useMemo(
    () => ({
      name: tempUser?.name || "Sean Kim",
      email: tempUser?.email || "sean@university.edu",
      walletAddress: tempUser?.walletAddress || "0x4a3b...f3b1",
      walletType: defaultDailyQ.walletType,
      dailyQ: dailyQStats,
    }),
    [dailyQStats, tempUser],
  );

  const myBuildings = ownedNfts.length > 0 ? ownedNfts : [];

  const initials = profile.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`relative min-h-full px-4 pb-6 ${SIDEBAR_BUTTON_SAFE_TOP_CLASS}`}
      style={{ backgroundColor: APP_BACKGROUND }}
    >
      
      <section>
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#bdbdbd] bg-[#dedede] text-4xl font-bold text-[#9d9d9d]">
            {initials}
          </div>

          <div>
            <h1 className="text-[44px] font-bold leading-none text-[#10314f]">{profile.name}</h1>
            <p className="mt-2 text-2xl text-[#9a9a9a]">{profile.email}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-[#c9c9c9] bg-[#f4f4f4] px-3 py-3 text-center">
            <p className="text-4xl font-bold leading-none text-[#10314f]">{balance}</p>
            <p className="mt-1 text-lg text-[#6c6c6c]">Tokens Balance</p>
          </div>
          <div className="rounded-xl border border-[#c9c9c9] bg-[#f4f4f4] px-3 py-3 text-center">
            <p className="text-4xl font-bold leading-none text-[#10314f]">{myBuildings.length}</p>
            <p className="mt-1 text-lg text-[#6c6c6c]">My Buildings</p>
          </div>
        </div>
      </section>

      <section className="mt-6 border-t border-[#dfdfdf] pt-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-wide text-[#6f6f6f]">DAILY Q HISTORY</h2>
          {/* daily q history로 이동 */}
          <button type="button" onClick={() => navigate("/daily-q")} className="text-xl font-semibold text-[#10314f]">View History →</button>
        </div>

        <div className="flex rounded-xl border border-[#c9c9c9] bg-[#f4f4f4]">
          <div className="flex-1 py-3 text-center">
            <p className="text-5xl font-bold leading-none text-[#2f8b3f]">{profile.dailyQ.received}</p>
            <p className="mt-1 text-xl text-[#2f8b3f]">Received</p>
          </div>
          <div className="my-3 w-px bg-[#d5d5d5]" />
          <div className="flex-1 py-3 text-center">
            <p className="text-5xl font-bold leading-none text-[#b56a00]">{profile.dailyQ.pending}</p>
            <p className="mt-1 text-xl text-[#b56a00]">Pending</p>
          </div>
          <div className="my-3 w-px bg-[#d5d5d5]" />
          <div className="flex-1 py-3 text-center">
            <p className="text-5xl font-bold leading-none text-[#d63a2f]">{profile.dailyQ.notCredited}</p>
            <p className="mt-1 text-xl text-[#d63a2f]">Not Credited</p>
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
        <h2 className="mb-3 text-xl font-semibold tracking-wide text-[#6f6f6f]">ACCOUNT</h2>
        <div className="overflow-hidden rounded-xl border border-[#c9c9c9] bg-[#f4f4f4]">
          <div className="grid grid-cols-[120px_1fr] border-b border-[#d7d7d7] px-4 py-3 text-lg">
            <p className="font-semibold text-[#10314f]">Email</p>
            <p className="truncate text-[#6b6b6b]">{profile.email}</p>
          </div>
          <div className="grid grid-cols-[120px_1fr] border-b border-[#d7d7d7] px-4 py-3 text-lg">
            <p className="font-semibold text-[#10314f]">Wallet</p>
            <p className="truncate text-[#6b6b6b]">{profile.walletAddress}</p>
          </div>
          <div className="grid grid-cols-[120px_1fr] border-b border-[#d7d7d7] px-4 py-3 text-lg">
            <p className="font-semibold text-[#10314f]">Wallet Type</p>
            <p className="truncate text-[#6b6b6b]">{profile.walletType}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
