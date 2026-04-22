type HeaderProps = {
  isLogin: boolean;
};

export default function header({ isLogin }: HeaderProps) {
  return (
    <header className="w-full px-4 py-3">
      <div className="rounded-xl border border-white/10 bg-black/30 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-white font-semibold">modubot</div>
          <div className="text-white/80 text-sm">
            {isLogin ? "로그인됨" : "로그아웃됨"}
          </div>
        </div>
      </div>
    </header>
  );
}

