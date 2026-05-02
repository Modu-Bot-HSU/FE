import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNftGoods, type NftGoodsItem } from "../../apis/blockchain/blockchain";

// 지도 위 건물 배치 설정 (mockup 기준)
type BuildingConfig = {
  index: number;
  label: string;
  x: number; // % 기준
  y: number;
  w: number;
  h: number;
};

const BUILDING_CONFIGS: BuildingConfig[] = [
  { index: 0, label: "Main Library",   x: 7,  y: 12, w: 24, h: 18 },
  { index: 1, label: "Science Hall",   x: 44, y: 8,  w: 21, h: 17 },
  { index: 2, label: "Student Union",  x: 20, y: 52, w: 24, h: 17 },
  { index: 3, label: "Clock Tower",    x: 54, y: 64, w: 15, h: 22 },
  { index: 4, label: "Gymnasium",      x: 66, y: 30, w: 18, h: 14 },
];

export default function NftMapPage() {
  const navigate = useNavigate();
  const [goods, setGoods] = useState<NftGoodsItem[]>([]);
  const [selected, setSelected] = useState<NftGoodsItem | null>(null);
  const [loading, setLoading] = useState(true);

  const accessToken = localStorage.getItem("accessToken") ?? undefined;

  useEffect(() => {
    getNftGoods(accessToken)
      .then(setGoods)
      .catch(() => setGoods([]))
      .finally(() => setLoading(false));
  }, [accessToken]);

  const getItem = (index: number) => goods.find((g) => g.index === index);

  const handleBuildingClick = (index: number) => {
    const item = getItem(index);
    if (item) setSelected(item);
  };

  return (
    <div className="flex h-full flex-col bg-[#f0ede8]">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#f0ede8]">
        <div className="flex items-center gap-2">
          <button className="flex flex-col gap-1 p-1">
            <span className="block h-0.5 w-5 bg-slate-700" />
            <span className="block h-0.5 w-5 bg-slate-700" />
            <span className="block h-0.5 w-5 bg-slate-700" />
          </button>
          <span className="text-lg font-semibold text-slate-800">Campus Map</span>
        </div>
        <button
          onClick={() => navigate("/campus/collection")}
          className="flex items-center gap-1 rounded-full bg-slate-800 px-3 py-1 text-xs text-white"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Collection →
        </button>
      </div>

      {/* 지도 영역 */}
      <div className="relative flex-1 overflow-hidden mx-3 rounded-xl bg-[#e8e4de]">
        {/* 도로 (수평) */}
        <div className="absolute left-0 right-0 bg-[#d6d1ca]" style={{ top: "44%", height: "7%" }} />
        {/* 도로 (수직) */}
        <div className="absolute top-0 bottom-0 bg-[#d6d1ca]" style={{ left: "38%", width: "6%" }} />

        {/* 건물 블록 */}
        {BUILDING_CONFIGS.map((cfg) => {
          const item = getItem(cfg.index);
          const isOwned = item?.isSold ?? false;
          const isSelected = selected?.index === cfg.index;

          return (
            <button
              key={cfg.index}
              onClick={() => handleBuildingClick(cfg.index)}
              className="absolute flex flex-col items-center"
              style={{
                left: `${cfg.x}%`,
                top: `${cfg.y}%`,
                width: `${cfg.w}%`,
              }}
            >
              <div
                className={`w-full rounded transition-all ${
                  isSelected
                    ? "bg-slate-500 shadow-md"
                    : isOwned
                    ? "bg-slate-500"
                    : "bg-slate-300"
                }`}
                style={{ height: `${cfg.h * 3}px` }}
              />
              <span className="mt-1 text-center text-[10px] leading-tight text-slate-600">
                {loading ? "..." : (item?.name ?? cfg.label)}
                {isOwned && " ✓"}
              </span>
            </button>
          );
        })}

        {/* 줌 버튼 */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-1">
          <button className="flex h-8 w-8 items-center justify-center rounded bg-white shadow text-slate-700 text-lg font-bold">
            +
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded bg-white shadow text-slate-700 text-lg font-bold">
            −
          </button>
        </div>
      </div>

      {/* 하단 선택 시트 */}
      <div
        className={`transition-all duration-300 bg-white rounded-t-2xl shadow-lg overflow-hidden ${
          selected ? "max-h-52" : "max-h-0"
        }`}
      >
        {selected && (
          <div className="px-5 py-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{selected.name}</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  12 owners · Landmark · {selected.price} tokens
                </p>
              </div>
              <button
                onClick={() => navigate(`/campus/${selected.index}`)}
                className="flex items-center gap-1 rounded-full bg-slate-900 px-4 py-1.5 text-sm font-medium text-white"
              >
                View →
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-2xl font-bold text-slate-900">
                {selected.price} tokens
              </span>
            </div>

            {selected.isSold && (
              <span className="mt-2 inline-block rounded-full bg-red-100 px-3 py-0.5 text-xs text-red-600">
                판매완료
              </span>
            )}
          </div>
        )}
      </div>

      {/* 시트 닫기 영역 */}
      {selected && (
        <button
          className="fixed inset-0 z-[-1]"
          onClick={() => setSelected(null)}
          aria-label="닫기"
        />
      )}
    </div>
  );
}
