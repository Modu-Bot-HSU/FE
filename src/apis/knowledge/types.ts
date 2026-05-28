export type KnowledgeCategory =
  | "academic"
  | "scholarship"
  | "facility"
  | "campus_life"
  | "career"
  | "it_service"
  | "support"
  | "etc";

export const KNOWLEDGE_CATEGORY_LABELS: Record<KnowledgeCategory, string> = {
  academic: "학사일정",
  scholarship: "장학",
  facility: "편의시설",
  campus_life: "학교 생활",
  career: "취업/진로",
  it_service: "IT 서비스",
  support: "학생 지원",
  etc: "기타",
};

export type KnowledgeItem = {
  id: string;
  category: KnowledgeCategory;
  title: string;
  content: string;
  source: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  approved_by: string;
};

export type KnowledgeListResponse = {
  total_count: number;
  knowledges: KnowledgeItem[];
  next_offset: string | null;
};

export type KnowledgeListParams = {
  category?: KnowledgeCategory;
  limit?: number;
  offset?: string;
};

export type KnowledgeSubmitBody = {
  category: KnowledgeCategory;
  content: string;
  questionId: string;
};

export type KnowledgeMutationResponse = {
  message: string;
  requestId: string;
};

export type KnowledgeUpdateBody = {
  category: KnowledgeCategory;
  content: string;
  questionId: string;
};

export type KnowledgeDeleteBody = {
  reason?: string;
};

export type KnowledgeSubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";

export type KnowledgeSubmissionType = "CREATE" | "UPDATE" | "DELETE";

export type KnowledgeSubmissionItem = {
  id: string;
  type: KnowledgeSubmissionType;
  status: KnowledgeSubmissionStatus;
  knowledgeId: string | null;
  submittedByWallet: string;
  category: string;
  content: string;
  questionId: string | null;
  originalQuestion: string | null;
  rejectReason: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type KnowledgeSubmissionListParams = {
  status?: KnowledgeSubmissionStatus;
};
