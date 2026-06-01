import type { KnowledgeCategory } from "../../apis/knowledge/types";

/** Daily Q UI 카테고리 (디자인 기준) */
export const DAILY_Q_CATEGORY_OPTIONS: { label: string; value: KnowledgeCategory }[] = [
  { label: "Facilities", value: "facility" },
  { label: "Academic", value: "academic" },
  { label: "Food & Dining", value: "campus_life" },
  { label: "Transport", value: "etc" },
  { label: "Events", value: "campus_life" },
  { label: "Other", value: "etc" },
];

export function getDailyQCategoryLabel(category: string): string {
  const found = DAILY_Q_CATEGORY_OPTIONS.find((item) => item.value === category);
  if (found) return found.label;
  const map: Record<string, string> = {
    academic: "Academic",
    scholarship: "Scholarship",
    facility: "Facilities",
    campus_life: "Campus Life",
    career: "Career",
    it_service: "IT Service",
    support: "Support",
    etc: "Other",
  };
  return map[category] ?? category;
}

export function formatDailyQDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export const DAILY_Q_PRIMARY = "#FF5C00";
export const DAILY_Q_NAVY = "#0F253E";
export const DAILY_Q_MUTED = "#717171";
