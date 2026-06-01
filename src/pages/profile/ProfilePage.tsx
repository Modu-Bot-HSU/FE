import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyPage, type NftGoodsItem } from "../../apis/blockchain/blockchain";
import { fetchMyKnowledgeSubmissions } from "../../apis/knowledge/knowledge";
import { clearAuthTokens } from "../../apis/auth/auth";
import { useAuthStore } from "../../store/useAuthStore";
import { APP_BACKGROUND, SIDEBAR_BUTTON_SAFE_TOP_CLASS } from "../../utils/layout";
import NftGridSection from "../../components/shop/NftGridSection";
import BuildingDetailModal from "../../components/map/BuildingDetailModal";
import ProfileHeader from "./components/ProfileHeader";
import DailyQStatsSection from "./components/DailyQStatsSection";
import AccountSection from "./components/AccountSection";
import LogoutModal from "./components/LogoutModal";

type DailyQStats = { received: number; pending: number; notCredited: number };

const DEFAULT_STATS: DailyQStats = { received: 0, pending: 0, notCredited: 0 };

export default function ProfilePage() {
  const navigate = useNavigate();
  const tempUser = useAuthStore((state) => state.tempUser);
  const accessToken = localStorage.getItem("accessToken") ?? undefined;

  const [balance, setBalance] = useState("");
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [ownedNfts, setOwnedNfts] = useState<NftGoodsItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<NftGoodsItem | null>(null);
  const [dailyQStats, setDailyQStats] = useState<DailyQStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([getMyPage(accessToken), fetchMyKnowledgeSubmissions()])
      .then(([myPageResult, submissionsResult]) => {
        if (myPageResult.status === "fulfilled") {
          const p = myPageResult.value;
          console.log("[ProfilePage] mypage:", p);
          setBalance(p.hsTokenBalance);
          setEmail(p.email);
          setWalletAddress(p.walletAddress);
          setOwnedNfts(
            Array.isArray(p.nfts)
              ? p.nfts.map((n) => ({
                  ...n,
                  isSold: true,
                  owner: p.walletAddress,
                  txHash: n.txHash ?? null,
                }))
              : [],
          );
        } else {
          console.warn("[ProfilePage] mypage fetch failed:", myPageResult.reason);
        }

        if (submissionsResult.status === "fulfilled") {
          console.log("[ProfilePage] submissions:", submissionsResult.value);
          setDailyQStats(
            countCreateSubmissionStats(
              Array.isArray(submissionsResult.value) ? submissionsResult.value : [],
            ),
          );
        } else {
          console.warn("[ProfilePage] submissions fetch failed:", submissionsResult.reason);
        }
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

  const handleLogout = () => {
    clearAuthTokens();
    navigate("/auth/login", { replace: true });
  };

  return (
    <div
      className={`relative min-h-full px-4 pb-6 ${SIDEBAR_BUTTON_SAFE_TOP_CLASS}`}
      style={{ backgroundColor: APP_BACKGROUND }}
    >
      
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
          <button type="button" onClick={() => navigate("/daily-q")} className="text-xl font-semibold text-[#10314f]">View History →</button>
        </div>

      <DailyQStatsSection stats={dailyQStats} />

      <section className="mt-6 border-t border-[#dfdfdf] pt-4">
        <NftGridSection
          title="MY BUILDINGS"
          items={ownedNfts}
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

      <AccountSection
        email={email || tempUser?.email || ""}
        walletAddress={walletAddress || tempUser?.walletAddress || ""}
        onLogout={() => setShowLogoutModal(true)}
      />

      {showLogoutModal && (
        <LogoutModal onCancel={() => setShowLogoutModal(false)} onConfirm={handleLogout} />
      )}
    </div>
  );
}
