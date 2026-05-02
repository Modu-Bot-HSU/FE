import { useMemo, useState } from "react";
import type { FormEvent } from "react";

type HttpMethod = "GET" | "POST";

type ApiResult = {
  status: string;
  ok: boolean;
  body: string;
};

type NftGood = {
  index: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  metadataUrl: string;
  isSold: boolean;
  txHash: string | null;
  owner: string | null;
};

const DEFAULT_BASE_URL = "/api";

export default function ApiTestPage() {
  const [baseUrl, setBaseUrl] = useState(DEFAULT_BASE_URL);
  const [accessToken, setAccessToken] = useState("");

  const [rewardTo, setRewardTo] = useState(
    "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  );
  const [rewardAmount, setRewardAmount] = useState("100");
  const [purchaseIndex, setPurchaseIndex] = useState("1");

  const [goodsResult, setGoodsResult] = useState<ApiResult | null>(null);
  const [goodsData, setGoodsData] = useState<NftGood[] | null>(null);
  const [purchaseResult, setPurchaseResult] = useState<ApiResult | null>(null);
  const [rewardResult, setRewardResult] = useState<ApiResult | null>(null);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  const sanitizedBaseUrl = useMemo(
    () => baseUrl.trim().replace(/\/$/, ""),
    [baseUrl],
  );

  async function callApi(
    endpoint: string,
    method: HttpMethod,
    body?: Record<string, string | number>,
  ): Promise<ApiResult> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (accessToken.trim()) {
      headers.Authorization = `Bearer ${accessToken.trim()}`;
    }

    const response = await fetch(`${sanitizedBaseUrl}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const text = await response.text();
    let formattedBody = text || "(응답 본문 없음)";

    try {
      formattedBody = JSON.stringify(JSON.parse(text), null, 2);
    } catch {
      // text 응답은 그대로 사용
    }

    return {
      status: `${response.status} ${response.statusText}`,
      ok: response.ok,
      body: formattedBody,
    };
  }

  async function onGoodsFetch(e: FormEvent) {
    e.preventDefault();
    setLoadingKey("goods");
    try {
      const result = await callApi("/blockchain/nft/goods", "GET");
      setGoodsResult(result);
      
      // 응답이 성공이면 NFT 배열 파싱
      if (result.ok) {
        try {
          const parsed = JSON.parse(result.body);
          if (Array.isArray(parsed)) {
            setGoodsData(parsed);
          }
        } catch {
          setGoodsData(null);
        }
      } else {
        setGoodsData(null);
      }
    } catch (error) {
      setGoodsResult({
        status: "Fetch Error",
        ok: false,
        body: error instanceof Error ? error.message : "알 수 없는 오류",
      });
      setGoodsData(null);
    } finally {
      setLoadingKey(null);
    }
  }

  async function onPurchase(e: FormEvent) {
    e.preventDefault();
    setLoadingKey("purchase");
    try {
      const result = await callApi("/blockchain/nft/purchase", "POST", {
        index: Number(purchaseIndex),
      });
      setPurchaseResult(result);
    } catch (error) {
      setPurchaseResult({
        status: "Fetch Error",
        ok: false,
        body: error instanceof Error ? error.message : "알 수 없는 오류",
      });
    } finally {
      setLoadingKey(null);
    }
  }

  async function onReward(e: FormEvent) {
    e.preventDefault();
    setLoadingKey("reward");
    try {
      const result = await callApi("/blockchain/reward", "POST", {
        to: rewardTo,
        amount: rewardAmount,
      });
      setRewardResult(result);
    } catch (error) {
      setRewardResult({
        status: "Fetch Error",
        ok: false,
        body: error instanceof Error ? error.message : "알 수 없는 오류",
      });
    } finally {
      setLoadingKey(null);
    }
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-12 text-slate-100">
      <h1 className="mb-2 text-2xl font-bold">관리자/상점 API 간편 테스트</h1>
      <p className="mb-6 text-sm text-slate-300">
        배포 서버에 직접 요청해서 보상 지급, NFT 상점 조회, NFT 구매를 빠르게
        점검할 수 있습니다.
      </p>
      <p className="mb-6 text-xs text-amber-300">
        개발 환경(localhost)에서는 CORS 이슈를 피하기 위해 Base URL을 /api로 두는
        것을 권장합니다.
      </p>

      <section className="mb-6 grid gap-4 rounded-xl border border-white/10 bg-black/30 p-4">
        <label className="text-sm font-medium">Base URL</label>
        <input
          className="rounded-lg border border-white/20 bg-black/40 px-3 py-2 outline-none"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          placeholder="/api"
        />

        <label className="text-sm font-medium">Access Token (옵션)</label>
        <input
          className="rounded-lg border border-white/20 bg-black/40 px-3 py-2 outline-none"
          value={accessToken}
          onChange={(e) => setAccessToken(e.target.value)}
          placeholder="Bearer 제외 토큰값"
        />
      </section>

      <section className="mb-6 rounded-xl border border-white/10 bg-black/30 p-4">
        <h2 className="mb-3 text-lg font-semibold">1) NFT 상점 품목 조회</h2>
        <form onSubmit={onGoodsFetch} className="space-y-3">
          <button
            type="submit"
            disabled={loadingKey === "goods"}
            className="rounded-lg bg-sky-600 px-4 py-2 font-medium hover:bg-sky-500 disabled:opacity-50"
          >
            {loadingKey === "goods" ? "요청 중..." : "GET /blockchain/nft/goods"}
          </button>
        </form>
        <ResultBox result={goodsResult} />
        {goodsData && <NftGoodsList goods={goodsData} />}
      </section>

      <section className="mb-6 rounded-xl border border-white/10 bg-black/30 p-4">
        <h2 className="mb-3 text-lg font-semibold">2) NFT 구매</h2>
        <form onSubmit={onPurchase} className="space-y-3">
          <label className="block text-sm font-medium">index (string)</label>
          <input
            className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 outline-none"
            value={purchaseIndex}
            onChange={(e) => setPurchaseIndex(e.target.value)}
            placeholder="1"
          />
          <button
            type="submit"
            disabled={loadingKey === "purchase"}
            className="rounded-lg bg-emerald-600 px-4 py-2 font-medium hover:bg-emerald-500 disabled:opacity-50"
          >
            {loadingKey === "purchase"
              ? "요청 중..."
              : "POST /blockchain/nft/purchase"}
          </button>
        </form>
        <ResultBox result={purchaseResult} />
      </section>

      <section className="rounded-xl border border-white/10 bg-black/30 p-4">
        <h2 className="mb-3 text-lg font-semibold">3) 관리자 토큰 보상 지급</h2>
        <form onSubmit={onReward} className="space-y-3">
          <label className="block text-sm font-medium">to (지갑 주소)</label>
          <input
            className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 outline-none"
            value={rewardTo}
            onChange={(e) => setRewardTo(e.target.value)}
            placeholder="0x..."
          />

          <label className="block text-sm font-medium">amount (string)</label>
          <input
            className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 outline-none"
            value={rewardAmount}
            onChange={(e) => setRewardAmount(e.target.value)}
            placeholder="100"
          />

          <button
            type="submit"
            disabled={loadingKey === "reward"}
            className="rounded-lg bg-violet-600 px-4 py-2 font-medium hover:bg-violet-500 disabled:opacity-50"
          >
            {loadingKey === "reward" ? "요청 중..." : "POST /blockchain/reward"}
          </button>
        </form>
        <ResultBox result={rewardResult} />
      </section>
    </main>
  );
}

function ResultBox({ result }: { result: ApiResult | null }) {
  if (!result) {
    return (
      <div className="mt-4 rounded-lg border border-white/10 bg-black/40 p-3 text-sm text-slate-300">
        아직 요청 결과가 없습니다.
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-lg border border-white/10 bg-black/40 p-3 text-sm">
      <p className={result.ok ? "text-emerald-400" : "text-rose-400"}>
        Status: {result.status}
      </p>
      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-all text-slate-200">
        {result.body}
      </pre>
    </div>
  );
}

function NftGoodsList({ goods }: { goods: NftGood[] }) {
  return (
    <div className="mt-6">
      <h3 className="mb-3 text-base font-semibold text-slate-200">
        NFT 품목 목록 ({goods.length}개)
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {goods.map((nft) => (
          <div
            key={nft.index}
            className="rounded-lg border border-white/10 bg-black/50 p-4"
          >
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-slate-100">{nft.name}</h4>
                <p className="text-xs text-slate-400">#{nft.index}</p>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  nft.isSold
                    ? "bg-red-500/20 text-red-300"
                    : "bg-emerald-500/20 text-emerald-300"
                }`}
              >
                {nft.isSold ? "판매완료" : "판매중"}
              </span>
            </div>
            
            {nft.imageUrl && (
              <img
                src={nft.imageUrl}
                alt={nft.name}
                className="mb-3 h-40 w-full rounded-lg border border-white/5 bg-black/30 object-cover"
              />
            )}
            
            <p className="mb-2 text-sm text-slate-300">{nft.description}</p>
            
            <div className="space-y-1 text-xs text-slate-400">
              <p>
                <span className="font-medium text-slate-300">가격:</span> {nft.price} 토큰
              </p>
              {nft.owner && (
                <p>
                  <span className="font-medium text-slate-300">소유자:</span>{" "}
                  {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}
                </p>
              )}
              {nft.txHash && (
                <p>
                  <span className="font-medium text-slate-300">TX:</span>{" "}
                  {nft.txHash.slice(0, 8)}...
                </p>
              )}
            </div>
            
            <div className="mt-3 pt-3 border-t border-white/5">
              <a
                href={nft.metadataUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-sky-400 hover:text-sky-300"
              >
                메타데이터 보기 →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
