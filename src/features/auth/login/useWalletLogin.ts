import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../../../hooks/useForm";
import { buildPersonalSignPayload, getNonce, normalizeWalletAddress } from "../../../apis/auth/auth";
import { alertEthereumFlowError } from "./ethereumErrors";
import { useLoginMutation } from "./useLoginMutation";
import { ethereumRequest } from "../wallet/ethereumProvider";

export type LoginUiStep = "wallet" | "confirm";

export const useWalletLogin = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<LoginUiStep>("wallet");
  const [signingAddressRaw, setSigningAddressRaw] = useState("");
  const [isNavigatingToConfirm, setIsNavigatingToConfirm] = useState(false);
  const { values, handleChange, setValues } = useForm({ walletAddress: "" });
  const loginMutation = useLoginMutation();

  const normalizedInput = () => normalizeWalletAddress(values.walletAddress.trim());

  const connectMetaMask = async () => {
    try {
      const accounts = (await ethereumRequest<string[]>(
        "eth_requestAccounts",
      )) as string[];
      const raw = (accounts[0] ?? "").trim();
      if (!raw) {
        alert("메타마스크 계정을 찾을 수 없습니다.");
        return;
      }
      setValues((p) => ({ ...p, walletAddress: raw }));
    } catch (e) {
      alertEthereumFlowError(e);
    }
  };

  const goToConfirm = async () => {
    const target = normalizedInput();
    if (!target.startsWith("0x") || target.length !== 42) {
      alert("올바른 지갑 주소를 입력해주세요.");
      return;
    }
    setIsNavigatingToConfirm(true);
    try {
      const accounts = await ethereumRequest<string[]>("eth_requestAccounts");
      const raw = (accounts[0] ?? "").trim();
      if (!raw) {
        alert("메타마스크 계정을 찾을 수 없습니다.");
        return;
      }
      const active = normalizeWalletAddress(raw);
      if (!active) {
        alert("메타마스크 계정을 찾을 수 없습니다. 계정 연결 후 다시 시도해주세요.");
        return;
      }
      if (active !== target) {
        alert("입력한 지갑 주소와 메타마스크 선택 계정이 다릅니다.");
        return;
      }
      setSigningAddressRaw(raw);
      setStep("confirm");
    } catch (e) {
      alertEthereumFlowError(e);
    } finally {
      setIsNavigatingToConfirm(false);
    }
  };

  const confirmLogin = async () => {
    const active = normalizeWalletAddress(signingAddressRaw);
    try {
      const { nonce } = await getNonce({ walletAddress: active });
      const message = buildPersonalSignPayload(nonce);
      const signature = await ethereumRequest<string>("personal_sign", [message, signingAddressRaw]);
      loginMutation.mutate({ walletAddress: active, signature });
    } catch (e) {
      console.error(e);
      alertEthereumFlowError(e);
    }
  };

  return {
    step,
    setStep,
    walletAddress: values.walletAddress,
    handleWalletChange: handleChange,
    connectMetaMask,
    goToConfirm,
    confirmLogin,
    isPending: loginMutation.isPending,
    isNavigatingToConfirm,
    displayAddress: normalizedInput(),
    navigate,
  };
};
