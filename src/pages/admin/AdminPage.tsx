import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import {
  getDailyQResponses,
  approveDailyQ,
  rejectDailyQ,
  type DailyQResponseItem,
} from "../../apis/admin/dailyQ";
import { SIDEBAR_BUTTON_SAFE_TOP_CLASS } from "../../utils/layout";

type ResponseModalState = DailyQResponseItem | null;

const statusConfig: Record<
  DailyQResponseItem["status"],
  { color: string; bgColor: string; label: string }
> = {
  pending: { color: "text-[#B35900]", bgColor: "bg-amber-50", label: "Pending" },
  approved: { color: "text-emerald-600", bgColor: "bg-emerald-50", label: "Approved" },
  rejected: { color: "text-rose-600", bgColor: "bg-rose-50", label: "Rejected" },
};

export default function AdminPage() {
  const [responses, setResponses] = useState<DailyQResponseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModal, setSelectedModal] = useState<ResponseModalState>(null);
  const [modalTokens, setModalTokens] = useState("1");
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const accessToken = localStorage.getItem("accessToken") ?? undefined;

  const fetchResponses = async () => {
    setLoading(true);
    try {
      const result = await getDailyQResponses(accessToken);
      setResponses(result.responses);
      console.log("[AdminPage] Daily Q responses:", result.responses);
    } catch (error) {
      console.error("[AdminPage] Failed to fetch responses:", error);
      setMessage({ type: "error", text: "응답을 불러올 수 없습니다." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, [accessToken]);

  const handleApprove = async () => {
    if (!selectedModal) return;

    const tokens = Number(modalTokens);
    if (!Number.isFinite(tokens) || tokens <= 0) {
      setMessage({ type: "error", text: "유효한 토큰 수를 입력해주세요." });
      return;
    }

    setProcessingId(selectedModal.id);
    try {
      await approveDailyQ({ responseId: selectedModal.id, tokens }, accessToken);
      setMessage({ type: "success", text: "승인되었습니다." });
      setSelectedModal(null);
      setModalTokens("1");
      await fetchResponses();
    } catch (err) {
      const errorMsg =
        err instanceof AxiosError
          ? (err.response?.data as { message?: string })?.message ?? err.message
          : "승인에 실패했습니다.";
      setMessage({ type: "error", text: errorMsg });
      console.error("[AdminPage] Approve error:", err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (responseId: number) => {
    setProcessingId(responseId);
    try {
      await rejectDailyQ(responseId, accessToken);
      setMessage({ type: "success", text: "거절되었습니다." });
      await fetchResponses();
    } catch (err) {
      const errorMsg =
        err instanceof AxiosError
          ? (err.response?.data as { message?: string })?.message ?? err.message
          : "거절에 실패했습니다.";
      setMessage({ type: "error", text: errorMsg });
      console.error("[AdminPage] Reject error:", err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className={`min-h-full bg-[#f3f3f3] px-4 py-10 ${SIDEBAR_BUTTON_SAFE_TOP_CLASS}`}>
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#002A47]">관리자 대시보드</h1>
          <p className="mt-2 text-[12px] text-[#78716D]">Daily Q 응답 승인 및 토큰 부여</p>
        </div>

        {/* Message Toast */}
        {message && (
          <div
            className={`mb-4 rounded-lg px-4 py-3 text-sm font-medium ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-slate-400">불러오는 중...</p>
          </div>
        ) : responses.length === 0 ? (
          <div className="rounded-xl border border-[#D6D3D1] bg-white p-8 text-center">
            <p className="text-[14px] text-[#78716D]">검토할 응답이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {responses.map((response) => {
              const config = statusConfig[response.status];
              return (
                <div
                  key={response.id}
                  className="overflow-hidden rounded-xl border border-[#D6D3D1] bg-white shadow-sm"
                >
                  <div className="p-4">
                    {/* Header Row */}
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-semibold text-[#002A47]">{response.userName}</p>
                        <p className="mt-1 text-[12px] text-[#78716D]">{response.userEmail}</p>
                      </div>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${config.color} ${config.bgColor}`}
                      >
                        {config.label}
                      </span>
                    </div>

                    {/* Question */}
                    <div className="mb-3">
                      <p className="text-[12px] font-medium text-[#78716D]">질문</p>
                      <p className="mt-1 text-[14px] text-[#002A47]">{response.question}</p>
                    </div>

                    {/* Answer */}
                    <div className="mb-3">
                      <p className="text-[12px] font-medium text-[#78716D]">답변</p>
                      <p className="mt-1 line-clamp-3 text-[13px] text-slate-600">
                        {response.answer}
                      </p>
                    </div>

                    {/* Meta */}
                    <div className="mb-4 flex items-center gap-4 text-[12px] text-[#78716D]">
                      <span>{new Date(response.submittedAt).toLocaleDateString("ko-KR")}</span>
                      {response.tokens && (
                        <span className="font-semibold text-[#fc5100]">+{response.tokens} tokens</span>
                      )}
                    </div>

                    {/* Actions */}
                    {response.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedModal(response);
                            setModalTokens("1");
                          }}
                          disabled={processingId === response.id}
                          className="flex-1 rounded-lg bg-[#fc5100] py-2 text-sm font-semibold text-white disabled:bg-slate-300"
                        >
                          {processingId === response.id ? "처리 중..." : "승인하기"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(response.id)}
                          disabled={processingId === response.id}
                          className="flex-1 rounded-lg border border-rose-200 bg-rose-50 py-2 text-sm font-semibold text-rose-600 disabled:bg-slate-100 disabled:text-slate-400"
                        >
                          거절
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Approval Modal */}
      {selectedModal && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-black/40"
          onClick={() => setSelectedModal(null)}
        >
          <div
            className="w-full rounded-t-3xl bg-white p-5 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-[#002A47]">
              {selectedModal.userName}님에게 토큰 부여
            </h3>
            <p className="mt-2 text-[13px] text-[#78716D]">응답: {selectedModal.answer}</p>

            {/* Token Input */}
            <div className="mt-4">
              <label className="block text-[12px] font-medium text-[#78716D]">부여할 토큰 수</label>
              <input
                type="number"
                value={modalTokens}
                onChange={(e) => setModalTokens(e.target.value)}
                min="1"
                className="mt-2 w-full rounded-lg border border-[#D6D3D1] px-3 py-2 text-[14px] outline-none focus:border-[#fc5100]"
              />
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedModal(null)}
                className="flex-1 rounded-lg border border-[#D6D3D1] bg-white py-3 font-semibold text-[#78716D]"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleApprove}
                disabled={processingId === selectedModal.id}
                className="flex-1 rounded-lg bg-[#fc5100] py-3 font-semibold text-white disabled:bg-slate-300"
              >
                {processingId === selectedModal.id ? "처리 중..." : "승인"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
