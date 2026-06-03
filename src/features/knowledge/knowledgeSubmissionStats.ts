import type { KnowledgeSubmissionItem } from "../../apis/knowledge/types";

/** CREATE 제출만 Daily Q / 프로필 통계에 반영 */
export function countCreateSubmissionStats(items: KnowledgeSubmissionItem[]) {
  const creates = items.filter((i) => i.type === "CREATE");
  return {
    received: creates.filter((i) => i.status === "APPROVED").length,
    pending: creates.filter((i) => i.status === "PENDING").length,
    notCredited: creates.filter((i) => i.status === "REJECTED").length,
  };
}
