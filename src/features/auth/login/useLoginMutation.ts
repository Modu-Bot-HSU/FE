import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { extractAccessToken, login, type LoginRequest } from "../../../apis/auth/auth";

export const useLoginMutation = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (data) => {
      const accessToken = extractAccessToken(data);
      if (accessToken) localStorage.setItem("accessToken", accessToken);
      alert("로그인에 성공하였습니다!");
      navigate("/");
    },
    onError: (error: unknown) => {
      alert(error instanceof Error ? error.message : "로그인 실패");
    },
  });
};
