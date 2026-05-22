import { API_BASE_URL, getBearerAuthHeaders, parseApiResponse } from "../httpClient";
import type {
  KnowledgeDeleteBody,
  KnowledgeSubmissionItem,
  KnowledgeSubmissionStatus,
  KnowledgeListParams,
  KnowledgeListResponse,
  KnowledgeMutationResponse,
  KnowledgeSubmitBody,
  KnowledgeUpdateBody,
} from "./types";

function knowledgeListQuery(params: KnowledgeListParams): string {
  const search = new URLSearchParams();
  if (params.category) search.set("category", params.category);
  if (params.limit != null) search.set("limit", String(params.limit));
  if (params.offset) search.set("offset", params.offset);
  const q = search.toString();
  return q ? `?${q}` : "";
}

/** GET /knowledge — 인증 불필요 */
export async function fetchKnowledgeList(
  params: KnowledgeListParams = {},
): Promise<KnowledgeListResponse> {
  const response = await fetch(`${API_BASE_URL}/knowledge${knowledgeListQuery(params)}`, {
    method: "GET",
  });
  return parseApiResponse<KnowledgeListResponse>(response);
}

/** POST /knowledge/submit */
export async function submitKnowledge(
  body: KnowledgeSubmitBody,
): Promise<KnowledgeMutationResponse> {
  const response = await fetch(`${API_BASE_URL}/knowledge/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getBearerAuthHeaders() },
    body: JSON.stringify(body),
  });
  return parseApiResponse<KnowledgeMutationResponse>(response);
}

/** POST /knowledge/:knowledgeId/update */
export async function requestKnowledgeUpdate(
  knowledgeId: string,
  body: KnowledgeUpdateBody,
): Promise<KnowledgeMutationResponse> {
  const id = encodeURIComponent(knowledgeId);
  const response = await fetch(`${API_BASE_URL}/knowledge/${id}/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getBearerAuthHeaders() },
    body: JSON.stringify(body),
  });
  return parseApiResponse<KnowledgeMutationResponse>(response);
}

/** POST /knowledge/:knowledgeId/delete */
export async function requestKnowledgeDelete(
  knowledgeId: string,
  body: KnowledgeDeleteBody = {},
): Promise<KnowledgeMutationResponse> {
  const id = encodeURIComponent(knowledgeId);
  const response = await fetch(`${API_BASE_URL}/knowledge/${id}/delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getBearerAuthHeaders() },
    body: JSON.stringify(body),
  });
  return parseApiResponse<KnowledgeMutationResponse>(response);
}

/** GET /knowledge/my-submissions */
export async function fetchMySubmissions(
  status?: KnowledgeSubmissionStatus,
): Promise<KnowledgeSubmissionItem[]> {
  const query = new URLSearchParams();
  if (status) query.set("status", status);
  const queryString = query.toString();

  const response = await fetch(
    `${API_BASE_URL}/knowledge/my-submissions${queryString ? `?${queryString}` : ""}`,
    {
      method: "GET",
      headers: { ...getBearerAuthHeaders() },
    },
  );

  return parseApiResponse<KnowledgeSubmissionItem[]>(response);
}
