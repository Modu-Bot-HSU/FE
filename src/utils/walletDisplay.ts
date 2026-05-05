/** e.g. `0x4a3b...f3b1` — avoids exposing the full address in UI. */
export function truncateMiddleWalletAddress(
  address: string,
  headChars = 6,
  tailChars = 4,
): string {
  const a = address.trim();
  if (a.length <= headChars + tailChars + 3) return a;
  return `${a.slice(0, headChars)}...${a.slice(-tailChars)}`;
}
