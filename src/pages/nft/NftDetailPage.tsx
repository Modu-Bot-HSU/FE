import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getNftGoods,
  purchaseNft,
  type NftGoodsItem,
} from "../../apis/blockchain/blockchain";
import { AxiosError } from "axios";

export default function NftDetailPage() {
  const { index } = useParams<{ index: string }>();
  const navigate = useNavigate();

  const [item, setItem] = useState<NftGoodsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const accessToken = localStorage.getItem("accessToken") ?? undefined;

  useEffect(() => {
    const idx = Number(index);
    if (Number.isNaN(idx)) {
      setLoading(false);
      return;
    }

    getNftGoods(accessToken)
      .then((data) => {
        const found = data.find((g) => g.index === idx) ?? null;
        setItem(found);
      })
      .catch(() => setItem(null))
      .finally(() => setLoading(false));
  }, [index, accessToken]);

  const handlePurchase = async () => {
    if (!item) return;
    setPurchasing(true);
    setMessage(null);

    try {
      await purchaseNft({ index: item.index }, accessToken);
      setMessage({ ok: true, text: "구매 완료! NFT가 지갑에 전송됩니다." });
    } catch (err) {
      const msg =
        err instanceof AxiosError
          ? (err.response?.data as { message?: string })?.message ?? err.message
          : "구매 중 오류가 발생했습니다.";
      setMessage({ ok: false, text: msg });
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-white">
        <p className="text-sm text-slate-400">불러오는 중...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-white gap-3">
        <p className="text-sm text-slate-500">NFT를 찾을 수 없습니다.</p>
        <button
          onClick={() => navigate("/campus")}
          className="text-sm text-slate-800 underline"
        >
          지도로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-slate-600"
        >
          ← Back
        </button>
        <span className="text-base font-semibold text-slate-900">{item.name}</span>
        <div className="w-12" />
      </div>

      {/* 이미지 */}
      <div className="relative bg-slate-100 mx-4 mt-4 rounded-xl overflow-hidden aspect-video flex items-center justify-center">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-xs text-slate-400">3D closeup render</span>
        )}
      </div>

      {/* 본문 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* 이름 + 가격 */}
        <div className="flex items-start justify-between">
          <h1 className="text-xl font-bold text-slate-900">{item.name}</h1>
          <span className="text-xl font-bold text-slate-900">
            {item.price} tokens
          </span>
        </div>

        {/* 설명 */}
        <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>

        {/* 태그 */}
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-600">
            Landmark
          </span>
          <span className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-600">
            Limited: 50
          </span>
        </div>

        {/* 소유 정보 */}
        <p className="text-sm text-slate-500">
          {item.isSold
            ? "이미 판매된 NFT입니다."
            : "12 students own this building"}
        </p>

        {/* txHash */}
        {item.txHash && (
          <p className="text-xs text-slate-400 break-all">
            TX: {item.txHash}
          </p>
        )}

        {/* 메시지 */}
        {message && (
          <div
            className={`rounded-lg p-3 text-sm ${
              message.ok
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-600"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>

      {/* 구매 버튼 */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={handlePurchase}
          disabled={item.isSold || purchasing}
          className={`w-full rounded-2xl py-4 text-base font-semibold transition-colors ${
            item.isSold
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-slate-900 text-white hover:bg-slate-700 active:bg-slate-800"
          } disabled:opacity-60`}
        >
          {purchasing
            ? "처리 중..."
            : item.isSold
            ? "판매완료"
            : `Purchase · ${item.price} tokens`}
        </button>
      </div>
    </div>
  );
}
