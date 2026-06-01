import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyPage, type NftGoodsItem } from "../../apis/blockchain/blockchain";
import { fetchMyKnowledgeSubmissions } from "../../apis/knowledge/knowledge";
import { clearAuthTokens } from "../../apis/auth/auth";
import { useAuthStore } from "../../store/useAuthStore";
import { countCreateSubmissionStats } from "../../features/knowledge/knowledgeSubmissionStats";
import { SIDEBAR_BUTTON_SAFE_TOP_CLASS } from "../../utils/layout";
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
  const [profileName, setProfileName] = useState("");
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
          setProfileName(p.name ?? "");
          setBalance(p.hsTokenBalance);
          setEmail(p.email);
          setWalletAddress(p.walletAddress);
          setOwnedNfts(
            Array.isArray(p.nfts)
              ? p.nfts.map((n) => ({
                  ...n,
                  isSold: true,
                  ownerName: p.name ?? tempUser?.name ?? null,
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
  }, [accessToken, tempUser?.name]);

  const handleLogout = () => {
    clearAuthTokens();
    navigate("/auth/login", { replace: true });
  };

  return (
    <div className={`relative min-h-full bg-[#f3f3f3] px-4 pb-6 ${SIDEBAR_BUTTON_SAFE_TOP_CLASS}`}>
      <ProfileHeader
        name={profileName || tempUser?.name || ""}
        email={email || tempUser?.email || ""}
        balance={balance}
        buildingCount={ownedNfts.length}
      />

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
        balance={balance}
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
