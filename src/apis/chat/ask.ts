import { API_BASE_URL } from "../httpClient";

export type AskSource = {
  knowledge_id: string;
  category: string;
  source: string;
  created_by: string;
};

type AskEnvelope = {
  success: boolean;
  message: string | null;
  data: { answer: string; sources: AskSource[] } | null;
  error: { code?: string; message?: string } | null;
};

function extractErrorMessage(status: number, body: unknown): string {
  let message = `Request failed with status ${status}`;
  if (typeof body === "object" && body !== null) {
    const err = (body as { error?: { message?: unknown }; message?: unknown }).error?.message;
    const top = (body as { message?: unknown }).message;
    const pick = typeof err === "string" ? err : typeof top === "string" ? top : null;
    if (pick) message = pick;
  }
  return message;
}

/** POST /api/v1/ask — RAG 챗봇 (인증 불필요) */
export async function postAsk(question: string): Promise<{ answer: string; sources: AskSource[] }> {
  const response = await fetch(`${API_BASE_URL}/api/v1/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    throw new Error(extractErrorMessage(response.status, body));
  }

  const envelope = body as AskEnvelope;
  if (envelope && envelope.success === false) {
    throw new Error(envelope.error?.message ?? "답변을 가져오지 못했습니다.");
  }

  const data = envelope?.data;
  if (!data || typeof data.answer !== "string") {
    throw new Error("서버 응답 형식이 올바르지 않습니다.");
  }

  return {
    answer: data.answer,
    sources: Array.isArray(data.sources) ? data.sources : [],
  };
}
