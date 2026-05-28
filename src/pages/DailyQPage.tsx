import { useEffect, useMemo, useState } from "react";
import { fetchMyKnowledgeSubmissions, submitKnowledge } from "../apis/knowledge/knowledge";
import type { KnowledgeSubmissionItem, KnowledgeSubmissionStatus } from "../apis/knowledge/types";
import { fetchNextQuestion, type QuestionItem } from "../apis/questions/questions";

type Step = "swipe" | "write" | "submit" | "submitted" | "history";

const statusColor: Record<KnowledgeSubmissionStatus, string> = {
  APPROVED: "text-emerald-600 bg-emerald-50",
  PENDING: "text-amber-600 bg-amber-50",
  REJECTED: "text-rose-600 bg-rose-50",
};

const primaryBtn = "w-full rounded-xl bg-[#FF5C00] py-3 text-center text-sm font-semibold text-white";
const secondaryBtn =
  "w-full rounded-xl border border-gray-300 bg-white py-3 text-center text-sm font-semibold text-gray-700";

export default function DailyQPage() {
  const [step, setStep] = useState<Step>("swipe");
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState<QuestionItem | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [history, setHistory] = useState<KnowledgeSubmissionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const answerLength = useMemo(() => answer.trim().length, [answer]);
  const canSubmit = answerLength >= 10;

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

  const loadHistory = async (status?: KnowledgeSubmissionStatus) => {
    setIsLoading(true);
    setError(null);
    try {
      const items = await fetchMyKnowledgeSubmissions(status ? { status } : {});
      setHistory(items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "제출 기록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadQuestion();
    void loadHistory();
  }, []);

  const handleSubmit = async () => {
    if (!question || !canSubmit) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await submitKnowledge({
        category: question.category,
        content: answer.trim(),
        questionId: question.id,
      });
      setStep("submitted");
      setAnswer("");
      await Promise.all([loadQuestion(), loadHistory()]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "제출 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F5F5] px-6 pt-24 pb-8">
      {error ? <p className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
      {(step === "swipe" || step === "write" || step === "submit") && (
        <section className="flex min-h-[78vh] flex-col">
          <p className="mb-2 text-sm text-gray-500">남은 질문 기회: {remaining}</p>
          <p className="mb-6 text-4xl font-semibold leading-tight text-[#0f263a]">
            {question?.text ?? (isLoading ? "질문을 불러오는 중..." : "답변 가능한 질문이 없습니다.")}
          </p>

          {step === "swipe" && (
            <>
              <p className="mt-auto text-xs text-gray-400">Swipe for next question</p>
              <div className="mt-2 space-y-2">
                <button
                  type="button"
                  className={primaryBtn}
                  onClick={() => setStep("write")}
                  disabled={!question || isLoading}
                >
                  I know this
                </button>
                <button type="button" className={secondaryBtn} onClick={() => void loadQuestion()}>
                  Skip
                </button>
              </div>
            </>
          )}

          {(step === "write" || step === "submit") && (
            <>
              <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4">
                <label className="mb-2 block text-lg font-semibold text-slate-800">Write your answer</label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer..."
                  className="h-28 w-full resize-none rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-slate-400"
                />
                <p className="mt-2 text-right text-xs text-gray-400">{answerLength} / 280</p>
              </div>

              <div className="mt-auto space-y-2">
                {step === "write" ? (
                  <>
                    <button
                      type="button"
                      className={`${primaryBtn} disabled:bg-orange-300`}
                      disabled={!canSubmit || !question}
                      onClick={() => setStep("submit")}
                    >
                      Submit Answer
                    </button>
                    <button
                      type="button"
                      className="w-full text-center text-sm font-medium text-gray-500"
                      onClick={() => setStep("history")}
                    >
                      Go back to questions
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className={`${primaryBtn} disabled:bg-orange-300`}
                      disabled={!canSubmit || !question || isSubmitting}
                      onClick={() => void handleSubmit()}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Answer"}
                    </button>
                    <button
                      type="button"
                      className="w-full text-center text-sm font-medium text-gray-500"
                      onClick={() => setStep("write")}
                    >
                      Edit answer
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </section>
      )}

      {step === "submitted" && (
        <section className="flex min-h-[78vh] flex-col items-center justify-center text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-slate-300 text-xl text-slate-700">
            ✓
          </div>
          <h2 className="text-4xl font-semibold text-slate-900">Submitted</h2>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-500">
            Admin will review your answer. Credits will be added once approved.
          </p>
          <div className="mt-10 w-full max-w-sm space-y-2">
            <button type="button" className={primaryBtn} onClick={() => setStep("history")}>
              View answer history
            </button>
            <button
              type="button"
              className={secondaryBtn}
              onClick={() => {
                setStep("swipe");
                void loadQuestion();
              }}
            >
              Go back home
            </button>
          </div>
        </section>
      )}

      {step === "history" && (
        <section className="min-h-[78vh]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-4xl font-semibold text-[#0f263a]">Daily Q History</h2>
            <button type="button" className={secondaryBtn} onClick={() => setStep("swipe")}>
              Back
            </button>
          </div>
          <div className="mb-3 flex gap-2">
            <button type="button" className={secondaryBtn} onClick={() => void loadHistory()}>
              ALL
            </button>
            <button type="button" className={secondaryBtn} onClick={() => void loadHistory("PENDING")}>
              PENDING
            </button>
            <button type="button" className={secondaryBtn} onClick={() => void loadHistory("APPROVED")}>
              APPROVED
            </button>
            <button type="button" className={secondaryBtn} onClick={() => void loadHistory("REJECTED")}>
              REJECTED
            </button>
          </div>
          <div className="space-y-3">
            {history.map((item) => (
              <article key={item.id} className="rounded-xl border border-gray-200 bg-white p-3">
                <div className="mb-1 flex items-start justify-between gap-3">
                  <p className="text-xs font-semibold text-slate-700">
                    {item.originalQuestion ?? "질문 텍스트 없음"}
                  </p>
                  <span
                    className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-semibold ${
                      statusColor[item.status]
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-gray-500">{item.content}</p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
                  <span>{new Date(item.createdAt).toLocaleString()}</span>
                  <span>{item.type}</span>
                </div>
              </article>
            ))}
            {!isLoading && history.length === 0 ? (
              <p className="py-10 text-center text-sm text-gray-500">제출 기록이 없습니다.</p>
            ) : null}
          </div>
        </section>
      )}
    </main>
  );
}
