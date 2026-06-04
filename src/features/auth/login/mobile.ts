export const isMobileWeb = () => {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

export const hasInjectedEthereum = () =>
  typeof window !== "undefined" && Boolean(window.ethereum);

export const openMetaMaskDappDeepLink = () => {
  if (typeof window === "undefined") return;
  const currentUrl = window.location.href.replace(/^https?:\/\//, "");
  window.location.href = `https://metamask.app.link/dapp/${currentUrl}`;
};
