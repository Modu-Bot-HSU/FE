import { API_BASE_URL, getBearerAuthHeaders, parseApiResponse } from "../httpClient";
import type { KnowledgeCategory } from "../knowledge/types";

export type QuestionItem = {
  id: string;
  text: string;
  category: KnowledgeCategory;
  isActive: boolean;
  createdAt: string;
};

export type NextQuestionResponse = {
  message: string;
  data: QuestionItem | null;
  remaining: number;
};

/** GET /questions/next */
export async function fetchNextQuestion(): Promise<NextQuestionResponse> {
  const response = await fetch(`${API_BASE_URL}/questions/next`, {
    method: "GET",
    headers: { ...getBearerAuthHeaders() },
  });
  return parseApiResponse<NextQuestionResponse>(response);
}
