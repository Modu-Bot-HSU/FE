import CustomInput from "../../components/common/Input";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { signup, type SignUpRequest } from "../../apis/auth/auth"; 

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [name, setName] = useState("");
  const { mutate, isPending } = useMutation({
    mutationFn: (data: SignUpRequest) => signup(data),
    onSuccess: (data) => {
      alert("회원가입 성공");
      console.log("서버 응답", data);
    },
    onError: (error: unknown) => {
      let message = "알 수 없는 오류";
      if (axios.isAxiosError(error)) {
        const body = error.response?.data as { message?: string } | undefined;
        message = body?.message ?? error.message;
      }
      alert(`회원가입 실패: ${message}`);
      console.log("에러 상세", error);
    },
  });

  const handleComplete = () => {
    if (!email.includes("@hansung.ac.kr")) {
      alert("한성대학교 이메일만 사용 가능합니다.");
      return;
    }
    if (!walletAddress || !name) {
      alert("모든 정보를 입력해주세요.");
      return;
    }
    mutate({
      email,
      walletAddress,
      name,
    });
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen p-4">
      <div className="text-xl font-bold text-gray-500 mb-2">회원가입</div>
      
      <CustomInput
        placeholder="한성대 이메일 (@hansung.ac.kr)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <CustomInput
        placeholder="지갑 주소"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
      />
      <CustomInput
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button
        type="button"
        onClick={handleComplete}
        disabled={isPending}
        className={`w-full max-w-[320px] py-3 rounded-lg text-white font-bold transition-all ${
          isPending 
            ? "bg-gray-400 cursor-not-allowed" 
            : "bg-blue-500 hover:bg-blue-600 active:scale-95"
        }`}
      >
        {isPending ? "처리 중..." : "완료"}
      </button>
    </div>
  );
};

export default SignUp;