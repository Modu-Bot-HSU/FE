import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">404 </h1>
      <div className="mt-4">
        <Link to="/" className="text-slate-900 underline underline-offset-4 hover:text-slate-700">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

