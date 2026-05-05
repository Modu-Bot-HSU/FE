import { useMemo, useState } from "react";

type Step = "swipe" | "write" | "submit" | "submitted" | "history";
type HistoryStatus = "Approved" | "Pending" | "Rejected";

type HistoryItem = {
  id: number;
  question: string;
  answer: string;
  date: string;
  credits: number;
  status: HistoryStatus;
};

const QUESTION = "Which building has the best study rooms on campus?";

const MOCK_HISTORY: HistoryItem[] = [
  {
    id: 1,
    question: "What's the fastest food option near engineering?",
    answer: "The cart outside Building C - maybe 2-3 min wait between 12-1pm.",
    date: "Apr 17",
    credits: 1,
    status: "Approved",
  },
  {
    id: 2,
    question: "What's the fastest food option near engineering?",
    answer: "The cart outside Building C - maybe 2-3 min wait between 12-1pm.",
    date: "Apr 17",
    credits: 1,
    status: "Pending",
  },
  {
    id: 3,
    question: "What's the fastest food option near engineering?",
    answer: "The cart outside Building C - maybe 2-3 min wait between 12-1pm.",
    date: "Apr 17",
    credits: 1,
    status: "Rejected",
  },
];

const statusColor: Record<HistoryStatus, string> = {
  Approved: "text-emerald-600 bg-emerald-50",
  Pending: "text-amber-600 bg-amber-50",
  Rejected: "text-rose-600 bg-rose-50",
};

const primaryBtn = "w-full rounded-xl bg-[#FF5C00] py-3 text-center text-sm font-semibold text-white";
const secondaryBtn =
  "w-full rounded-xl border border-gray-300 bg-white py-3 text-center text-sm font-semibold text-gray-700";

export default function DailyQPage() {
  const [step, setStep] = useState<Step>("swipe");
  const [answer, setAnswer] = useState("");

  const answerLength = useMemo(() => answer.trim().length, [answer]);
  const canSubmit = answerLength >= 10;

  return (
    <main className="min-h-screen bg-[#F5F5F5] px-6 pt-24 pb-8">
      {(step === "swipe" || step === "write" || step === "submit") && (
        <section className="flex min-h-[78vh] flex-col">
          <p className="mb-6 text-4xl font-semibold leading-tight text-[#0f263a]">{QUESTION}</p>

          {step === "swipe" && (
            <>
              <p className="mt-auto text-xs text-gray-400">Swipe for next question</p>
              <div className="mt-2 space-y-2">
                <button type="button" className={primaryBtn} onClick={() => setStep("write")}>
                  I know this
                </button>
                <button type="button" className={secondaryBtn}>
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
                      disabled={!canSubmit}
                      onClick={() => setStep("submit")}
                    >
                      Submit Answer
                    </button>
                    <button type="button" className="w-full text-center text-sm font-medium text-gray-500">
                      Go back to questions
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className={`${primaryBtn} disabled:bg-orange-300`}
                      disabled={!canSubmit}
                      onClick={() => setStep("submitted")}
                    >
                      Submit Answer
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
            <button type="button" className={secondaryBtn} onClick={() => setStep("swipe")}>
              Go back home
            </button>
          </div>
        </section>
      )}

      {step === "history" && (
        <section className="min-h-[78vh]">
          <h2 className="mb-4 text-4xl font-semibold text-[#0f263a]">Daily Q History</h2>
          <div className="space-y-3">
            {MOCK_HISTORY.map((item) => (
              <article key={item.id} className="rounded-xl border border-gray-200 bg-white p-3">
                <div className="mb-1 flex items-start justify-between gap-3">
                  <p className="text-xs font-semibold text-slate-700">{item.question}</p>
                  <span
                    className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-semibold ${statusColor[item.status]}`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-gray-500">{item.answer}</p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
                  <span>{item.date}</span>
                  <span>+{item.credits} credits</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
