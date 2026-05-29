import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyPage,
  type NftGoodsItem,
} from "../../apis/blockchain/blockchain";
import { fetchMyKnowledgeSubmissions } from "../../apis/knowledge/knowledge";
import { clearAuthTokens } from "../../apis/auth/auth";
import { useAuthStore } from "../../store/useAuthStore";
import { SIDEBAR_BUTTON_SAFE_TOP_CLASS } from "../../utils/layout";
import NftGridSection from "../../components/shop/NftGridSection";
import BuildingDetailModal from "../../components/map/BuildingDetailModal";
import { countCreateSubmissionStats } from "../../features/knowledge/knowledgeSubmissionStats";

type ProfileDailyQStats = {
  received: number;
  pending: number;
  notCredited: number;
};

const defaultDailyQStats: ProfileDailyQStats = {
  received: 0,
  pending: 0,
  notCredited: 0,
};



export default function ProfilePage() {
  const navigate = useNavigate();
  const tempUser = useAuthStore((state) => state.tempUser);
  const [balance, setBalance] = useState("");
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [ownedNfts, setOwnedNfts] = useState<NftGoodsItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<NftGoodsItem | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submissionStats, setSubmissionStats] = useState<ProfileDailyQStats>(defaultDailyQStats);

  const accessToken = localStorage.getItem("accessToken") ?? undefined;

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      getMyPage(accessToken),
      fetchMyKnowledgeSubmissions(),
    ])
      .then(([myPageResult, submissionsResult]) => {
        if (myPageResult.status === "fulfilled") {
          const myPage = myPageResult.value;
          console.log("[ProfilePage] mypage:", myPage);
          setBalance(myPage.hsTokenBalance);
          setEmail(myPage.email);
          setWalletAddress(myPage.walletAddress);
          setOwnedNfts(
            myPage.nfts.map((n) => ({
              ...n,
              isSold: true,
              owner: myPage.walletAddress,
              txHash: n.txHash ?? null,
            })),
          );
        } else {
          console.warn("[ProfilePage] mypage fetch failed:", myPageResult.reason);
          setOwnedNfts([]);
        }

        if (submissionsResult.status === "fulfilled") {
          console.log("[ProfilePage] submissions:", submissionsResult.value);
          setSubmissionStats(countCreateSubmissionStats(submissionsResult.value));
        } else {
          console.warn("[ProfilePage] submissions fetch failed:", submissionsResult.reason);
          setSubmissionStats(defaultDailyQStats);
        }
      })
      .catch(() => {
        setOwnedNfts([]);
        setSubmissionStats(defaultDailyQStats);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [accessToken]);

  const profile = useMemo(
    () => ({
      name: tempUser?.name ?? "",
      email: email || tempUser?.email || "",
      walletAddress: walletAddress || tempUser?.walletAddress || "",
      dailyQ: submissionStats,
    }),
    [email, walletAddress, submissionStats, tempUser],
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
          <button
            type="button"
            onClick={() => navigate("/daily-q/history")}
            className="text-[12px] font-medium text-[#10314f]"
          >
            View History →
          </button>
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
        </div>

        <button
          type="button"
          onClick={() => setShowLogoutModal(true)}
          className="mt-4 w-full rounded-xl border border-[#C0392B] py-3 text-[14px] font-medium text-[#C0392B] active:bg-rose-50"
        >
          로그아웃
        </button>
      </section>

      {/* 로그아웃 확인 모달 */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowLogoutModal(false)}
          />
          <div className="relative w-full max-w-[430px] rounded-t-3xl bg-white px-5 pt-6 pb-10 shadow-xl">
            <div className="mb-4 text-center">
              <p className="text-[17px] font-semibold text-[#002A47]">로그아웃 하시겠어요?</p>
              <p className="mt-1.5 text-[13px] text-[#78716D]">로그인 페이지로 이동합니다.</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 rounded-xl border border-[#D6D3D1] bg-[#f4f4f4] py-3 text-[14px] font-medium text-[#44403D]"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => {
                  clearAuthTokens();
                  navigate("/auth/login", { replace: true });
                }}
                className="flex-1 rounded-xl bg-[#C0392B] py-3 text-[14px] font-medium text-white"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
