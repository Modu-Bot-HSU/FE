import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getHsBalance,
  getNftGoods,
  type NftGoodsItem,
} from "../../apis/blockchain/blockchain";
import NftBuildingCard from "../../components/shop/NftBuildingCard";
import { useAuthStore } from "../../store/useAuthStore";

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

const ownedNftFallback: NftGoodsItem[] = [
  {
    index: 101,
    name: "Cedar Hall",
    description: "mock building",
    price: "20",
    imageUrl: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=900&auto=format&fit=crop",
    metadataUrl: "-",
    isSold: true,
    txHash: null,
    owner: null,
  },
  {
    index: 102,
    name: "Maple Center",
    description: "mock building",
    price: "32",
    imageUrl: "https://images.unsplash.com/photo-1464029902023-f42eba355bde?q=80&w=900&auto=format&fit=crop",
    metadataUrl: "-",
    isSold: true,
    txHash: null,
    owner: null,
  },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const tempUser = useAuthStore((state) => state.tempUser);
  const [balance, setBalance] = useState("12");
  const [ownedNfts, setOwnedNfts] = useState<NftGoodsItem[]>([]);

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

  const profile = useMemo(
    () => ({
      name: tempUser?.name || "Sean Kim",
      email: tempUser?.email || "sean@university.edu",
      walletAddress: tempUser?.walletAddress || "0x4a3b...f3b1",
      ...profileMock,
    }),
    [tempUser],
  );

  const myBuildings = ownedNfts.length > 0 ? ownedNfts : ownedNftFallback;

  const initials = profile.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative min-h-full bg-[#f3f3f3] px-4 pb-6 pt-4">
      
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
          <button type="button" className="text-xl font-semibold text-[#10314f]">View History →</button>
        </div>

        <div className="grid grid-cols-3 rounded-xl border border-[#c9c9c9] bg-[#f4f4f4]">
          <div className="py-3 text-center">
            <p className="text-5xl font-bold leading-none text-[#2f8b3f]">{profile.dailyQ.received}</p>
            <p className="mt-1 text-xl text-[#2f8b3f]">Received</p>
          </div>
          <div className="border-x border-[#d5d5d5] py-3 text-center">
            <p className="text-5xl font-bold leading-none text-[#b56a00]">{profile.dailyQ.pending}</p>
            <p className="mt-1 text-xl text-[#b56a00]">Pending</p>
          </div>
          <div className="py-3 text-center">
            <p className="text-5xl font-bold leading-none text-[#d63a2f]">{profile.dailyQ.notCredited}</p>
            <p className="mt-1 text-xl text-[#d63a2f]">Not Credited</p>
          </div>
        </div>
      </section>

      <section className="mt-6 border-t border-[#dfdfdf] pt-4">
        <h2 className="mb-3 text-xl font-semibold tracking-wide text-[#6f6f6f]">MY BUILDINGS</h2>
        <div className="grid grid-cols-2 gap-2">
          {myBuildings.map((item) => (
            <NftBuildingCard
              key={item.index}
              item={item}
              badgeText="Owned"
              onClick={() => navigate(`/campus/${item.index}`)}
            />
          ))}
        </div>
      </section>

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
