import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../../../hooks/useForm";
import { buildPersonalSignPayload, getNonce, normalizeWalletAddress } from "../../../apis/auth/auth";
import { alertEthereumFlowError } from "./ethereumErrors";
import { useLoginMutation } from "./useLoginMutation";
import { connectAndSignPersonal, ethereumRequest } from "../wallet/ethereumProvider";

export type LoginUiStep = "wallet" | "confirm";

export const useWalletLogin = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<LoginUiStep>("wallet");
  const [signingAddressRaw, setSigningAddressRaw] = useState("");
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

    setSigningAddressRaw(target);
    setStep("confirm");
  };

  const confirmLogin = async () => {
    const active = normalizeWalletAddress(signingAddressRaw);

    if (!active) {
      alert("올바른 지갑 주소를 입력해주세요.");
      setStep("wallet");
      return;
    }

    try {
      const { nonce } = await getNonce({ walletAddress: active });
      const message = buildPersonalSignPayload(nonce);
      const { account, signature } = await connectAndSignPersonal(message, active);
      loginMutation.mutate({ walletAddress: normalizeWalletAddress(account), signature });
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
    isNavigatingToConfirm: loginMutation.isPending,
    displayAddress: normalizedInput(),
    navigate,
  };
};
