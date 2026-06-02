import { lazy, Suspense, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMyPage, type NftGoodsItem } from "../../apis/blockchain/blockchain";
import { fetchMyKnowledgeSubmissions } from "../../apis/knowledge/knowledge";
import { clearAuthTokens } from "../../apis/auth/auth";
import { useAuthStore } from "../../store/useAuthStore";
import { countCreateSubmissionStats } from "../../features/knowledge/knowledgeSubmissionStats";
import { SIDEBAR_BUTTON_SAFE_TOP_CLASS } from "../../utils/layout";
import NftGridSection from "../../components/shop/NftGridSection";
import ProfileHeader from "./components/ProfileHeader";
import DailyQStatsSection from "./components/DailyQStatsSection";
import AccountSection from "./components/AccountSection";
import LogoutModal from "./components/LogoutModal";

type DailyQStats = { received: number; pending: number; notCredited: number };

const BuildingDetailModal = lazy(() => import("../../components/map/BuildingDetailModal"));

export default function ProfilePage() {
  const navigate = useNavigate();
  const tempUser = useAuthStore((state) => state.tempUser);
  const accessToken = localStorage.getItem("accessToken") ?? undefined;

  const [selectedItem, setSelectedItem] = useState<NftGoodsItem | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const myPageQuery = useQuery({
    queryKey: ["my-page", accessToken],
    queryFn: () => getMyPage(accessToken),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
  });

  const submissionsQuery = useQuery({
    queryKey: ["my-create-submissions"],
    queryFn: () => fetchMyKnowledgeSubmissions(),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 1,
  });

  const profileName = myPageQuery.data?.name ?? tempUser?.name ?? "";
  const balance = myPageQuery.data?.hsTokenBalance ?? "";
  const email = myPageQuery.data?.email ?? tempUser?.email ?? "";
  const walletAddress = myPageQuery.data?.walletAddress ?? tempUser?.walletAddress ?? "";

  const ownedNfts = useMemo<NftGoodsItem[]>(() => {
    const p = myPageQuery.data;
    if (!p || !Array.isArray(p.nfts)) return [];

    return p.nfts.map((n) => ({
      ...n,
      isSold: true,
      ownerName: p.name ?? tempUser?.name ?? null,
      owner: p.walletAddress,
      txHash: n.txHash ?? null,
    }));
  }, [myPageQuery.data, tempUser?.name]);

  const dailyQStats = useMemo<DailyQStats>(() => {
    const submissions = submissionsQuery.data;
    return countCreateSubmissionStats(Array.isArray(submissions) ? submissions : []);
  }, [submissionsQuery.data]);

  const shouldShowNftSkeleton = myPageQuery.isPending && !myPageQuery.data;

  const handleLogout = () => {
    clearAuthTokens();
    navigate("/auth/login", { replace: true });
  };

  return (
    <div className={`relative min-h-full bg-[#f3f3f3] px-4 pb-6 ${SIDEBAR_BUTTON_SAFE_TOP_CLASS}`}>
      <ProfileHeader
        name={profileName}
        email={email}
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
          isLoading={shouldShowNftSkeleton}
        />
      </section>

      <Suspense fallback={null}>
        <BuildingDetailModal
          item={selectedItem}
          balance={balance}
          onPurchase={() => {}}
          onClose={() => setSelectedItem(null)}
          isPurchasing={false}
          purchaseMessage={null}
          closeLabel="profile"
        />
      </Suspense>

      <AccountSection
        email={email}
        walletAddress={walletAddress}
        onLogout={() => setShowLogoutModal(true)}
      />

      {showLogoutModal && (
        <LogoutModal onCancel={() => setShowLogoutModal(false)} onConfirm={handleLogout} />
      )}
    </div>
  );
}
