import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import {
  approveAdminRequest,
  getPendingRequests,
  rejectAdminRequest,
  type AdminRequestStatus,
  type PendingRequestItem,
} from "../../apis/admin/dailyQ";
import { SIDEBAR_BUTTON_SAFE_TOP_CLASS } from "../../utils/layout";

type RejectModalState = PendingRequestItem | null;

const statusConfig: Record<
  AdminRequestStatus,
  { color: string; bgColor: string; label: string }
> = {
  PENDING: { color: "text-[#B35900]", bgColor: "bg-amber-50", label: "Pending" },
  APPROVED: { color: "text-emerald-600", bgColor: "bg-emerald-50", label: "Approved" },
  REJECTED: { color: "text-rose-600", bgColor: "bg-rose-50", label: "Rejected" },
};

const requestTypeConfig: Record<PendingRequestItem["type"], { color: string; bgColor: string }> = {
  CREATE: { color: "text-sky-700", bgColor: "bg-sky-50" },
  UPDATE: { color: "text-violet-700", bgColor: "bg-violet-50" },
  DELETE: { color: "text-zinc-700", bgColor: "bg-zinc-100" },
};

const STATUS_FILTERS: AdminRequestStatus[] = ["PENDING", "APPROVED", "REJECTED"];

const formatDateTime = (iso: string | null) => {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const shortWallet = (wallet: string) => {
  if (wallet.length < 12) return wallet;
  return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
};

const getErrorMessage = (err: unknown, fallback: string) => {
  if (err instanceof AxiosError) {
    const payload = err.response?.data as { message?: string | string[] } | undefined;
    if (typeof payload?.message === "string") return payload.message;
    if (Array.isArray(payload?.message)) return payload.message.join("\n");
    if (err.message) return err.message;
  }
  return fallback;
};

export default function AdminPage() {
  const [requests, setRequests] = useState<PendingRequestItem[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<AdminRequestStatus>("PENDING");
  const [loading, setLoading] = useState(true);
  const [selectedRejectModal, setSelectedRejectModal] = useState<RejectModalState>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const accessToken = localStorage.getItem("accessToken") ?? undefined;

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const result = await getPendingRequests(selectedStatus, accessToken);
      setRequests(result);
    } catch (error) {
      setMessage({ type: "error", text: getErrorMessage(error, "요청 목록을 불러올 수 없습니다.") });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchRequests();
  }, [accessToken, selectedStatus]);

  const handleApprove = async (request: PendingRequestItem) => {
    setProcessingId(request.id);
    try {
      await approveAdminRequest(request.id, accessToken);
      setMessage({
        type: "success",
        text:
          request.type === "CREATE"
            ? "승인되었습니다. CREATE 요청은 서버에서 보상 지급이 자동 처리됩니다."
            : "승인되었습니다.",
      });
      await fetchRequests();
    } catch (err) {
      setMessage({ type: "error", text: getErrorMessage(err, "승인에 실패했습니다.") });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    if (!selectedRejectModal) return;

    setProcessingId(selectedRejectModal.id);
    try {
      await rejectAdminRequest(
        {
          requestId: selectedRejectModal.id,
          reason: rejectReason.trim() ? rejectReason.trim() : undefined,
        },
        accessToken,
      );
      setMessage({ type: "success", text: "반려 처리되었습니다." });
      setSelectedRejectModal(null);
      setRejectReason("");
      await fetchRequests();
    } catch (err) {
      setMessage({ type: "error", text: getErrorMessage(err, "반려 처리에 실패했습니다.") });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className={`min-h-full bg-[#f3f3f3] px-4 py-10 ${SIDEBAR_BUTTON_SAFE_TOP_CLASS}`}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#002A47]">관리자 대시보드</h1>
          <p className="mt-2 text-[14px] text-[#78716D]">지식 요청 승인/반려 및 상태 조회</p>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {STATUS_FILTERS.map((status) => {
            const config = statusConfig[status];
            const isActive = selectedStatus === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  isActive
                    ? `${config.bgColor} ${config.color} border-transparent`
                    : "border-[#D6D3D1] bg-white text-[#78716D]"
                }`}
              >
                {config.label}
              </button>
            );
          })}
        </div>

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

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-slate-400">불러오는 중...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-xl border border-[#D6D3D1] bg-white p-8 text-center">
            <p className="text-[14px] text-[#78716D]">해당 상태의 요청이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((request) => {
              const config = statusConfig[request.status];
              const typeConfig = requestTypeConfig[request.type];
              return (
                <div
                  key={request.id}
                  className="overflow-hidden rounded-xl border border-[#D6D3D1] bg-white shadow-sm"
                >
                  <div className="p-4">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${typeConfig.color} ${typeConfig.bgColor}`}
                          >
                            {request.type}
                          </span>
                          <p className="text-[12px] text-[#78716D]">{request.id}</p>
                        </div>
                        <p className="text-[13px] font-medium text-[#002A47]">
                          제출 지갑: {shortWallet(request.submittedByWallet)}
                        </p>
                      </div>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${config.color} ${config.bgColor}`}
                      >
                        {config.label}
                      </span>
                    </div>

                    <div className="mb-3 rounded-lg bg-[#F8F8F8] px-3 py-2 text-[12px] text-[#5f5f5f]">
                      카테고리: <span className="font-semibold text-[#1f1f1f]">{request.category}</span>
                    </div>

                    {request.originalQuestion && (
                      <div className="mb-3">
                        <p className="text-[12px] font-medium text-[#78716D]">원본 질문</p>
                        <p className="mt-1 text-[14px] text-[#002A47]">{request.originalQuestion}</p>
                      </div>
                    )}

                    <div className="mb-3">
                      <p className="text-[12px] font-medium text-[#78716D]">요청 내용</p>
                      <p className="mt-1 line-clamp-4 whitespace-pre-wrap break-words text-[13px] text-slate-600">
                        {request.content}
                      </p>
                    </div>

                    <div className="mb-4 space-y-1 text-[12px] text-[#78716D]">
                      <p>등록일: {formatDateTime(request.createdAt)}</p>
                      {request.knowledgeId && <p>대상 지식 ID: {request.knowledgeId}</p>}
                      {request.status === "APPROVED" && (
                        <p>
                          승인 정보: {request.approvedBy ? shortWallet(request.approvedBy) : "-"} / {formatDateTime(request.approvedAt)}
                        </p>
                      )}
                      {request.status === "REJECTED" && request.rejectReason && (
                        <p className="text-rose-600">반려 사유: {request.rejectReason}</p>
                      )}
                    </div>

                    {request.status === "PENDING" && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => void handleApprove(request)}
                          disabled={processingId === request.id}
                          className="flex-1 rounded-lg bg-[#fc5100] py-2 text-sm font-semibold text-white disabled:bg-slate-300"
                        >
                          {processingId === request.id ? "처리 중..." : "승인하기"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRejectModal(request);
                            setRejectReason(request.rejectReason ?? "");
                          }}
                          disabled={processingId === request.id}
                          className="flex-1 rounded-lg border border-rose-200 bg-rose-50 py-2 text-sm font-semibold text-rose-600 disabled:bg-slate-100 disabled:text-slate-400"
                        >
                          반려
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

      {selectedRejectModal && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-black/40"
          onClick={() => {
            setSelectedRejectModal(null);
            setRejectReason("");
          }}
        >
          <div
            className="w-full rounded-t-3xl bg-white p-5 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-[#002A47]">요청 반려 처리</h3>
            <p className="mt-2 text-[13px] text-[#78716D]">요청 ID: {selectedRejectModal.id}</p>

            <div className="mt-4">
              <label className="block text-[12px] font-medium text-[#78716D]">반려 사유 (선택)</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                placeholder="예: 정보 출처 확인이 어려워 반려합니다."
                className="mt-2 w-full rounded-lg border border-[#D6D3D1] px-3 py-2 text-[14px] outline-none focus:border-[#fc5100]"
              />
            </div>

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedRejectModal(null);
                  setRejectReason("");
                }}
                className="flex-1 rounded-lg border border-[#D6D3D1] bg-white py-3 font-semibold text-[#78716D]"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => void handleReject()}
                disabled={processingId === selectedRejectModal.id}
                className="flex-1 rounded-lg bg-rose-600 py-3 font-semibold text-white disabled:bg-slate-300"
              >
                {processingId === selectedRejectModal.id ? "처리 중..." : "반려"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
