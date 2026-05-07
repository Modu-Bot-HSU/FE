import AuthPageLayout from "../common/AuthPageLayout";
import FormActionButton from "../common/FormActionButton";
import CustomInput from "../common/Input";
import { useWalletLogin } from "../../pages/login/useWalletLogin";

const LoginPage = () => {
  const { walletAddress, handleWalletChange, handleLoginFlow, isPending, navigate } =
    useWalletLogin();

  return (
    <AuthPageLayout title="지갑 로그인">
      <CustomInput
        name="walletAddress"
        placeholder="지갑 주소 (0x...)"
        value={walletAddress}
        onChange={handleWalletChange}
      />
      <p className="max-w-[320px] text-xs text-gray-400 -mt-2">
        메타마스크에 보이는 주소처럼 대소문자가 섞여 있어도 정상(체크섬)이며, 같은 지갑입니다.
      </p>

      <FormActionButton onClick={handleLoginFlow} disabled={isPending} tone="orange">
        {isPending ? "로그인 중..." : "메타마스크로 로그인"}
      </FormActionButton>

      <button
        type="button"
        onClick={() => navigate("/auth/signup")}
        className="mt-2 text-sm text-gray-400 underline hover:text-gray-600"
      >
        처음이신가요? 회원가입하러 가기
      </button>
    </AuthPageLayout>
  );
};

export default LoginPage;
