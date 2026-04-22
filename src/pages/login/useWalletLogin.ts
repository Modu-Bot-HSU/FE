import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useForm } from "../../hooks/useForm";
import {
  buildPersonalSignPayload,
  extractAccessToken,
  getNonce,
  login,
  normalizeWalletAddress,
  type LoginRequest,
} from "../../apis/auth/auth";

const alertEthereumFlowError = (error: unknown) => {
  if (error instanceof Error && error.message) {
    alert(error.message);
    return;
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: number }).code === 4001
  ) {
    alert("서명을 거부하셨습니다.");
    return;
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: number }).code === 4100
  ) {
    alert("메타마스크 계정 연결 권한이 필요합니다.");
    return;
  }
  alert("오류가 발생했습니다. 다시 시도해주세요.");
};

export const useWalletLogin = () => {
  const navigate = useNavigate();
  const { values, handleChange } = useForm({
    walletAddress: "",
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (data) => {
      const accessToken = extractAccessToken(data);
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }
      alert("로그인에 성공하였습니다!");
      console.log("로그인 응답:", data);
      navigate("/");
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "로그인 실패";
      alert(message);
    },
  });

  const handleLoginFlow = async () => {
    const inputAddress = values.walletAddress.trim();
    const normalizedInputAddress = normalizeWalletAddress(inputAddress);

    if (!normalizedInputAddress.startsWith("0x") || normalizedInputAddress.length !== 42) {
      alert("올바른 지갑 주소를 입력해주세요.");
      return;
    }

    try {
      if (!window.ethereum) {
        alert("메타마스크 설치가 필요합니다.");
        return;
      }

      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];
      const activeAccountRaw = (accounts[0] ?? "").trim();
      const activeAccount = normalizeWalletAddress(activeAccountRaw);

      if (!activeAccount) {
        alert("메타마스크 계정을 찾을 수 없습니다. 계정 연결 후 다시 시도해주세요.");
        return;
      }

      if (activeAccount !== normalizedInputAddress) {
        alert("입력한 지갑 주소와 메타마스크 선택 계정이 다릅니다.");
        return;
      }

      const nonceResponse = await getNonce({ walletAddress: activeAccount });
      const { nonce } = nonceResponse;

      const message = buildPersonalSignPayload(nonce);
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, activeAccountRaw],
      });

      loginMutation.mutate({
        walletAddress: activeAccount,
        signature: signature as string,
      });
    } catch (error: unknown) {
      console.error("로그인 과정 오류:", error);
      alertEthereumFlowError(error);
    }
  };

  return {
    walletAddress: values.walletAddress,
    handleWalletChange: handleChange,
    handleLoginFlow,
    isPending: loginMutation.isPending,
    navigate,
  };
};
