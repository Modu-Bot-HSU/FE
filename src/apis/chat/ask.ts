import { API_BASE_URL, parseApiResponse } from "../httpClient";

export type ChatAskRequest = {
  question: string;
};

export type ChatAskResponse = {
  message: string;
  answer: string;
};

/** POST /chat/ask */
export async function askChat(body: ChatAskRequest): Promise<ChatAskResponse> {
  const response = await fetch(`${API_BASE_URL}/chat/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseApiResponse<ChatAskResponse>(response);
}
