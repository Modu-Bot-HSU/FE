import { NavLink } from "react-router-dom";

type HeaderProps = {
  isLogin: boolean;
};

export default function header({ isLogin }: HeaderProps) {
  return (
    <header className="w-full px-4 py-3">
      <div className="rounded-xl border border-white/10 bg-black/30 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-white font-semibold">modubot</div>
          <div className="flex items-center gap-4 text-sm text-white/80">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-white" : "hover:text-white"
              }
            >
              홈
            </NavLink>
            <NavLink
              to="/api-test"
              className={({ isActive }) =>
                isActive ? "text-white" : "hover:text-white"
              }
            >
              API 테스트
            </NavLink>
            <span>{isLogin ? "로그인됨" : "로그아웃됨"}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

