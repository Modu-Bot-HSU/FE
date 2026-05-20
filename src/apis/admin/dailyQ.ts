import { axiosInstance } from "../axios";

export type AdminRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export type AdminRequestType = "CREATE" | "UPDATE" | "DELETE";

export type PendingRequestItem = {
  id: string;
  type: AdminRequestType;
  status: AdminRequestStatus;
  knowledgeId: string | null;
  submittedByWallet: string;
  category: string;
  content: string;
  originalQuestion: string | null;
  rejectReason: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

// Backward-compatible aliases for older AdminPage imports.
export type DailyQResponseItem = PendingRequestItem;

export type DailyQResponsesResponse = {
  responses: DailyQResponseItem[];
  total: number;
};

export type ApproveAdminRequestResponse = {
  message: string;
  requestId: string;
  status: "APPROVED";
};

export type RejectAdminRequestPayload = {
  requestId: string;
  reason?: string;
};

export type RejectAdminRequestResponse = {
  message: string;
  requestId: string;
  status: "REJECTED";
};

export type RewardPayload = {
  to: string;
  amount: string;
};

export type RewardResponse = {
  message: string;
  txHash: string;
};

const createAuthConfig = (accessToken?: string) => {
  const token = accessToken?.trim();
  if (!token) return undefined;

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getPendingRequests = async (
  status: AdminRequestStatus | undefined,
  accessToken?: string,
): Promise<PendingRequestItem[]> => {
  const { data } = await axiosInstance.get<PendingRequestItem[]>(
    "/admin/pending-requests",
    {
      ...createAuthConfig(accessToken),
      params: status ? { status } : undefined,
    },
  );
  return data;
};

export const getDailyQResponses = async (
  accessToken?: string,
): Promise<DailyQResponsesResponse> => {
  const responses = await getPendingRequests("PENDING", accessToken);
  return {
    responses,
    total: responses.length,
  };
};

export const approveAdminRequest = async (
  requestId: string,
  accessToken?: string,
): Promise<ApproveAdminRequestResponse> => {
  const { data } = await axiosInstance.post<ApproveAdminRequestResponse>(
    `/admin/approve/${requestId}`,
    {},
    createAuthConfig(accessToken),
  );
  return data;
};

export const approveDailyQ = async (
  payload: { responseId: number; tokens: number },
  accessToken?: string,
): Promise<ApproveAdminRequestResponse> => {
  return approveAdminRequest(String(payload.responseId), accessToken);
};

export const rejectAdminRequest = async (
  payload: RejectAdminRequestPayload,
  accessToken?: string,
): Promise<RejectAdminRequestResponse> => {
  const { data } = await axiosInstance.post<RejectAdminRequestResponse>(
    `/admin/reject/${payload.requestId}`,
    payload.reason ? { reason: payload.reason } : {},
    createAuthConfig(accessToken),
  );
  return data;
};

export const rejectDailyQ = async (
  responseId: number,
  accessToken?: string,
): Promise<RejectAdminRequestResponse> => {
  return rejectAdminRequest({ requestId: String(responseId) }, accessToken);
};

export const rewardHsToken = async (
  payload: RewardPayload,
  accessToken?: string,
): Promise<RewardResponse> => {
  const { data } = await axiosInstance.post<RewardResponse>(
    "/blockchain/reward",
    payload,
    createAuthConfig(accessToken),
  );
  return data;
};
