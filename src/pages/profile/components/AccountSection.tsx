type Props = {
  email: string;
  walletAddress: string;
  onLogout: () => void;
};

export default function AccountSection({ email, walletAddress, onLogout }: Props) {
  return (
    <section className="mt-6 border-t border-[#dfdfdf] pt-4">
      <h2 className="mb-3 text-[12px] font-bold tracking-wide text-[#78716D]">ACCOUNT</h2>

      <div className="overflow-hidden rounded-xl border border-[#A8A29F] bg-[#f4f4f4]">
        <InfoRow label="Email" value={email} topBorder />
        <InfoRow label="Wallet" value={walletAddress} />
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="mt-4 w-full rounded-xl border border-[#C0392B] py-3 text-[14px] font-medium text-[#C0392B] active:bg-rose-50"
      >
        Sign Out
      </button>
    </section>
  );
}

function InfoRow({
  label,
  value,
  topBorder,
}: {
  label: string;
  value: string;
  topBorder?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-[120px_1fr] px-4 py-3 text-[14px] ${
        topBorder ? "border-[0.5px] border-[#d7d7d7]" : "border-b border-[#D6D3D1]"
      }`}
    >
      <p className="font-medium text-[#002A47]">{label}</p>
      <p className="truncate text-right text-[#78716D]">{value}</p>
    </div>
  );
}
