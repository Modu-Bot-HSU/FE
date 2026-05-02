import CustomInput from "../../components/common/Input";
import { useWalletLogin } from "./useWalletLogin";

const Login = () => {
  const { walletAddress, handleWalletChange, handleLoginFlow, isPending, navigate } =
    useWalletLogin();

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen p-4">
      <div className="text-xl font-bold text-gray-500 mb-2">지갑 로그인</div>

      <CustomInput
        name="walletAddress"
        placeholder="지갑 주소 (0x...)"
        value={walletAddress}
        onChange={handleWalletChange}
      />
      <p className="max-w-[320px] text-xs text-gray-400 -mt-2">
        메타마스크에 보이는 주소처럼 대소문자가 섞여 있어도 정상(체크섬)이며, 같은 지갑입니다.
      </p>

      <button
        type="button"
        onClick={handleLoginFlow}
        disabled={isPending}
        className={`w-full max-w-[320px] py-3 rounded-lg text-white font-bold transition-all ${
          isPending
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-orange-500 hover:bg-orange-600 active:scale-95"
        }`}
      >
        {isPending ? "로그인 중..." : "메타마스크로 로그인"}
      </button>

      <button
        type="button"
        onClick={() => navigate("/auth/signup")}
        className="mt-2 text-sm text-gray-400 hover:text-gray-600 underline"
      >
        처음이신가요? 회원가입하러 가기
      </button>
    </div>
  );
};

export default Login;
