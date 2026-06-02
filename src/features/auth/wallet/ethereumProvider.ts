import type { Hex, MetamaskConnectEVM } from "@metamask/connect-evm";

type EthereumProviderLike = {
  request: (args: { method: string; params?: unknown }) => Promise<unknown>;
};

const toHexChainId = (chainId: number): Hex => `0x${chainId.toString(16)}` as Hex;

const DEFAULT_CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID ?? "80002");
const DEFAULT_CHAIN_HEX = toHexChainId(DEFAULT_CHAIN_ID);
const DAPP_NAME = import.meta.env.VITE_APP_NAME ?? "ModuBot";
const DAPP_URL =
  import.meta.env.VITE_APP_URL ??
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:5173");

const SUPPORTED_NETWORKS: Record<Hex, string> = {
  "0x1": "https://ethereum-rpc.publicnode.com",
  "0x89": "https://polygon-rpc.com",
  "0xaa36a7": "https://rpc.sepolia.org",
  "0x13882": "https://rpc-amoy.polygon.technology",
  [DEFAULT_CHAIN_HEX]:
    DEFAULT_CHAIN_HEX === "0x13882"
      ? "https://rpc-amoy.polygon.technology"
      : `https://rpc.ankr.com/eth/${DEFAULT_CHAIN_ID}`,
};

let evmClientPromise: Promise<MetamaskConnectEVM> | null = null;

const shouldUseMetaMaskConnect = () => import.meta.env.VITE_USE_METAMASK_CONNECT !== "false";

const createClient = async () => {
  const { createEVMClient } = await import("@metamask/connect-evm");

  return createEVMClient({
    dapp: {
      name: DAPP_NAME,
      url: DAPP_URL,
    },
    api: {
      supportedNetworks: SUPPORTED_NETWORKS,
    },
    ui: {
      preferExtension: true,
      showInstallModal: true,
    },
  });
};

const getMetaMaskConnectClient = async (): Promise<MetamaskConnectEVM | null> => {
  if (!shouldUseMetaMaskConnect()) return null;

  try {
    if (!evmClientPromise) {
      evmClientPromise = createClient();
    }
    return await evmClientPromise;
  } catch (error) {
    console.warn("[ethereumProvider] MetaMask Connect init failed, fallback to window.ethereum", error);
    evmClientPromise = null;
    return null;
  }
};

export const getEthereumProvider = async (): Promise<EthereumProviderLike> => {
  const client = await getMetaMaskConnectClient();
  if (client) {
    return client.getProvider() as EthereumProviderLike;
  }

  if (!window.ethereum) {
    throw new Error("MetaMask를 설치해주세요.");
  }

  return window.ethereum as unknown as EthereumProviderLike;
};

export const ethereumRequest = async <T = unknown>(
  method: string,
  params?: unknown,
): Promise<T> => {
  const client = await getMetaMaskConnectClient();

  if (client && method === "eth_requestAccounts") {
    const { accounts } = await client.connect({ chainIds: [DEFAULT_CHAIN_HEX] });
    return accounts as T;
  }

  if (client && method === "wallet_switchEthereumChain") {
    const requestedChainId =
      Array.isArray(params) && params[0] && typeof params[0] === "object" && "chainId" in params[0]
        ? (params[0] as { chainId?: string }).chainId
        : undefined;

    if (requestedChainId) {
      await client.switchChain({ chainId: requestedChainId as Hex });
      return null as T;
    }
  }

  const provider = client
    ? (client.getProvider() as EthereumProviderLike)
    : await getEthereumProvider();

  return (await provider.request({ method, params })) as T;
};
