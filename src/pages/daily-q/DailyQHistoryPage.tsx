import { useEffect, useState } from "react";
import { fetchMySubmissions } from "../../apis/knowledge/knowledge";
import type { KnowledgeSubmissionItem, KnowledgeSubmissionStatus } from "../../apis/knowledge/types";
import { KNOWLEDGE_CATEGORY_LABELS } from "../../apis/knowledge/types";
import { SIDEBAR_BUTTON_SAFE_TOP_CLASS } from "../../utils/layout";



const statusStyle: Record<KnowledgeSubmissionStatus, string> = {
  APPROVED: "border-emerald-200 text-emerald-600 bg-emerald-50",
  PENDING: "border-amber-200 text-amber-600 bg-amber-50",
  REJECTED: "border-rose-200 text-rose-500 bg-rose-50",
};

const statusLabel: Record<KnowledgeSubmissionStatus, string> = {
  APPROVED: "Approved",
  PENDING: "Pending",
  REJECTED: "Not Credited",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getCategoryLabel(category: string): string {
  return KNOWLEDGE_CATEGORY_LABELS[category as keyof typeof KNOWLEDGE_CATEGORY_LABELS] ?? category;
}

export default function DailyQHistoryPage() {
  const [items, setItems] = useState<KnowledgeSubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchMySubmissions()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex h-full flex-col bg-[#F5F5F4]">
      {/* Header */}
      <div className={`px-5 pb-4 ${SIDEBAR_BUTTON_SAFE_TOP_CLASS}`}>
        <h1 className="text-3xl font-semibold tracking-tight text-[#10314f]">Daily Q History</h1>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-5 pb-8">
        {loading ? (
          <div className="space-y-3 pt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-2 h-3.5 w-3/4 rounded bg-slate-100" />
                <div className="mb-1 h-3 w-full rounded bg-slate-100" />
                <div className="h-3 w-2/3 rounded bg-slate-100" />
                <div className="mt-3 flex justify-between">
                  <div className="h-3 w-16 rounded bg-slate-100" />
                  <div className="h-3 w-16 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex h-48 items-center justify-center">
            <p className="text-[14px] text-[#78716D]">제출 내역이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            {items.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <div className="mb-1.5 flex items-start justify-between gap-3">
                  <p className="text-[14px] font-semibold leading-snug text-[#10314f]">
                    {item.originalQuestion ?? "질문 없음"}
                  </p>
                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${statusStyle[item.status]}`}
                  >
                    {statusLabel[item.status]}
                  </span>
                </div>
                <p className="text-[12px] leading-relaxed text-slate-600 line-clamp-2">{item.content}</p>
                {item.rejectReason && (
                  <p className="mt-1.5 text-[11px] text-[#fc5100] leading-relaxed">
                    반려 사유: {item.rejectReason}
                  </p>
                )}
                <div className="mt-2.5 flex items-center justify-between text-[12px] text-slate-500">
                  <span>{getCategoryLabel(item.category)}</span>
                  <div className="flex items-center gap-2">
                    <span>{formatDate(item.createdAt)}</span>
                    {item.status === "APPROVED" && (
                      <span className="font-semibold text-[#fc5100]">+1 credits</span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
