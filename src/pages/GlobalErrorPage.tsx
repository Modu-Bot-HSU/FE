import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function GlobalErrorPage() {
  const error = useRouteError();

  let title = "문제가 발생했습니다.";
  let message = "잠시 후 다시 시도해주세요.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    if (typeof error.data === "string" && error.data.trim()) {
      message = error.data;
    }
  } else if (error instanceof Error && error.message) {
    message = error.message;
  }

  return (
    <div className="flex min-h-full w-full items-center justify-center bg-[#f5f5f5] px-6 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-3 text-sm text-slate-600">{message}</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
            onClick={() => window.location.reload()}
          >
            새로고침
          </button>
          <Link
            to="/chat"
            className="rounded-lg bg-[#001F3F] px-4 py-2 text-sm font-semibold text-white"
          >
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}
