import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyKnowledgeSubmissions, submitKnowledge } from "../apis/knowledge/knowledge";
import type {
  KnowledgeCategory,
  KnowledgeSubmissionItem,
  KnowledgeSubmissionStatus,
} from "../apis/knowledge/types";
import { fetchNextQuestion, type QuestionItem } from "../apis/questions/questions";
import DailyQBottomSheet from "../components/dailyq/DailyQBottomSheet";
import DailyQProgressDots from "../components/dailyq/DailyQProgressDots";
import {
  DAILY_Q_CATEGORY_OPTIONS,
  DAILY_Q_MUTED,
  DAILY_Q_NAVY,
  DAILY_Q_PRIMARY,
  formatDailyQDate,
  getDailyQCategoryLabel,
} from "../features/dailyq/dailyQTheme";
import { SIDEBAR_BUTTON_SAFE_TOP_CLASS } from "../utils/layout";

type Step = "swipe" | "write" | "submitted" | "history";
type Sheet = "category" | "confirm" | null;

const statusLabel: Record<KnowledgeSubmissionStatus, string> = {
  APPROVED: "Approved",
  PENDING: "Pending",
  REJECTED: "Not Credited",
};

const statusStyle: Record<KnowledgeSubmissionStatus, string> = {
  APPROVED: "text-emerald-700 bg-emerald-50",
  PENDING: "text-amber-700 bg-amber-50",
  REJECTED: "text-rose-700 bg-rose-50",
};

const primaryBtn =
  "w-full rounded-xl py-3.5 text-center text-sm font-semibold text-white disabled:opacity-45";
const outlineBtn =
  "w-full rounded-xl border border-[#D1D1D1] bg-white py-3.5 text-center text-sm font-semibold text-[#717171]";

export default function DailyQPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("swipe");
  const [sheet, setSheet] = useState<Sheet>(null);
  const [answer, setAnswer] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<KnowledgeCategory | null>(null);
  const [question, setQuestion] = useState<QuestionItem | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [history, setHistory] = useState<KnowledgeSubmissionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const answerLength = useMemo(() => answer.trim().length, [answer]);
  const canSubmit = answerLength >= 10;
  const dailyLimit = 5;
  const progressIndex = Math.max(0, Math.min(dailyLimit - 1, dailyLimit - remaining));

  const loadQuestion = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchNextQuestion();
      setQuestion(response.data);
      setRemaining(response.remaining);
    } catch (e) {
      setError(e instanceof Error ? e.message : "질문을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const items = await fetchMyKnowledgeSubmissions();
      setHistory(items.filter((item) => item.type === "CREATE"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "제출 기록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadQuestion();
  }, []);

  const resetForNextQuestion = () => {
    setAnswer("");
    setSelectedCategory(null);
    setSheet(null);
    setStep("swipe");
  };

  const handleSubmit = async () => {
    if (!question || !selectedCategory || !canSubmit) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await submitKnowledge({
        category: selectedCategory,
        content: answer.trim(),
        questionId: question.id,
      });
      setSheet(null);
      setStep("submitted");
      await Promise.all([loadQuestion(), loadHistory()]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "제출 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const pickCategory = (category: KnowledgeCategory) => {
    setSelectedCategory(category);
    setSheet(null);
    setStep("write");
  };

  const questionText =
    question?.text ?? (isLoading ? "Loading question..." : "No more questions available today.");

  return (
    <main className={`min-h-full bg-[#F5F5F5] px-6 pb-8 ${SIDEBAR_BUTTON_SAFE_TOP_CLASS}`}>
      {error ? (
        <p className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
      ) : null}

      {step === "swipe" && (
        <section className="flex min-h-[78vh] flex-col">
          <DailyQProgressDots total={dailyLimit} activeIndex={progressIndex} />
          <p
            className="mb-auto font-serif text-[34px] font-bold leading-[1.15] tracking-tight sm:text-[38px]"
            style={{ color: DAILY_Q_NAVY }}
          >
            {questionText}
          </p>
          <p className="mt-auto text-center text-xs text-[#9CA3AF]">Swipe for next question</p>
          <div className="mt-3 space-y-3">
            <button
              type="button"
              className={primaryBtn}
              style={{ backgroundColor: DAILY_Q_PRIMARY }}
              disabled={!question || isLoading}
              onClick={() => setSheet("category")}
            >
              I know this
            </button>
            <button type="button" className="w-full py-2 text-center text-sm text-[#9CA3AF]" onClick={() => void loadQuestion()}>
              Skip
            </button>
          </div>
        </section>
      )}

      {step === "write" && (
        <section className="flex min-h-[78vh] flex-col">
          <DailyQProgressDots total={dailyLimit} activeIndex={progressIndex} />
          <p
            className="mb-6 font-serif text-[28px] font-bold leading-tight"
            style={{ color: DAILY_Q_NAVY }}
          >
            {questionText}
          </p>
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
            <label className="mb-2 block text-base font-semibold text-[#0F253E]">Write your answer</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer..."
              maxLength={280}
              className="h-36 w-full resize-none rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3 text-sm leading-relaxed text-[#374151] outline-none focus:border-[#FF5C00]"
            />
            <p className="mt-2 text-right text-xs text-[#9CA3AF]">{answerLength} / 280</p>
          </div>
          <div className="mt-auto space-y-3 pt-8">
            <button
              type="button"
              className={primaryBtn}
              style={{ backgroundColor: DAILY_Q_PRIMARY }}
              disabled={!canSubmit}
              onClick={() => setSheet("confirm")}
            >
              Submit Answer
            </button>
            <button
              type="button"
              className="w-full py-2 text-center text-sm font-medium text-[#717171]"
              onClick={resetForNextQuestion}
            >
              Go back to questions
            </button>
          </div>
        </section>
      )}

      {step === "submitted" && (
        <section className="flex min-h-[78vh] flex-col items-center justify-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#0F253E] text-2xl text-[#0F253E]">
            ✓
          </div>
          <h2 className="font-serif text-[40px] font-bold text-[#0F253E]">Submitted</h2>
          <p className="mt-3 max-w-xs text-sm leading-relaxed" style={{ color: DAILY_Q_MUTED }}>
            Admin will review your answer.
            <br />
            Credits will be added once approved.
          </p>
          <button
            type="button"
            className="mt-10 text-sm font-semibold text-[#0F253E] underline-offset-2 hover:underline"
            onClick={() => setStep("history")}
          >
            View answer history →
          </button>
          <div className="mt-auto w-full max-w-sm space-y-3 pt-10">
            <button
              type="button"
              className={primaryBtn}
              style={{ backgroundColor: DAILY_Q_PRIMARY }}
              onClick={() => {
                resetForNextQuestion();
                void loadQuestion();
              }}
            >
              Answer another question
            </button>
            <button type="button" className={outlineBtn} onClick={() => navigate("/chat")}>
              Go back home
            </button>
          </div>
        </section>
      )}

      {step === "history" && (
        <section className="min-h-[78vh]">
          <h2 className="mb-6 font-serif text-[38px] font-bold leading-tight text-[#0F253E]">
            Daily Q History
          </h2>
          <div className="space-y-3">
            {history.map((item) => (
              <article key={item.id} className="rounded-xl border border-[#E5E7EB] bg-white p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold leading-snug text-[#0F253E]">
                    {item.originalQuestion ?? "Question unavailable"}
                  </p>
                  <span
                    className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                      statusStyle[item.status]
                    }`}
                  >
                    {statusLabel[item.status]}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-[#717171]">{item.content}</p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-[#9CA3AF]">
                  <span>
                    {getDailyQCategoryLabel(item.category)} · {formatDailyQDate(item.createdAt)}
                  </span>
                  {item.status === "APPROVED" ? (
                    <span className="font-semibold text-[#374151]">+1 credits</span>
                  ) : null}
                </div>
              </article>
            ))}
            {!isLoading && history.length === 0 ? (
              <p className="py-10 text-center text-sm text-[#717171]">No submissions yet.</p>
            ) : null}
          </div>
          <button
            type="button"
            className={`${outlineBtn} mt-8`}
            onClick={() => {
              resetForNextQuestion();
              void loadQuestion();
            }}
          >
            Back to questions
          </button>
        </section>
      )}

      <DailyQBottomSheet open={sheet === "category"} onClose={() => setSheet(null)} title="What category is this?">
        <ul className="divide-y divide-[#E5E7EB]">
          {DAILY_Q_CATEGORY_OPTIONS.map((item) => (
            <li key={`${item.label}-${item.value}`}>
              <button
                type="button"
                className="w-full py-4 text-left text-base font-medium text-[#0F253E]"
                onClick={() => pickCategory(item.value)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </DailyQBottomSheet>

      <DailyQBottomSheet open={sheet === "confirm"} onClose={() => setSheet(null)} title="Submit your answer?">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium text-[#9CA3AF]">Category</p>
            <span className="mt-2 inline-block rounded-full border border-[#D1D1D1] px-3 py-1 text-sm text-[#0F253E]">
              {selectedCategory ? getDailyQCategoryLabel(selectedCategory) : "-"}
            </span>
          </div>
          <div>
            <p className="text-xs font-medium text-[#9CA3AF]">Your answer</p>
            <div className="mt-2 rounded-xl bg-[#F3F4F6] px-4 py-3 text-sm leading-relaxed text-[#374151]">
              {answer.trim()}
            </div>
          </div>
          <button
            type="button"
            className={primaryBtn}
            style={{ backgroundColor: DAILY_Q_PRIMARY }}
            disabled={!canSubmit || isSubmitting}
            onClick={() => void handleSubmit()}
          >
            {isSubmitting ? "Submitting..." : "Submit Answer"}
          </button>
          <button
            type="button"
            className="w-full py-2 text-center text-sm font-medium text-[#717171]"
            onClick={() => setSheet(null)}
          >
            ← Edit answer
          </button>
          <p className="pt-1 text-center text-[11px] leading-relaxed text-[#9CA3AF]">
            Once submitted, your answer is sent to admin for review. You can&apos;t edit after submitting.
            Approved answers earn credits.
          </p>
        </div>
      </DailyQBottomSheet>
    </main>
  );
}
