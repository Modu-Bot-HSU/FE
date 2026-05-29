import { useNavigate } from "react-router-dom";

type DailyQStats = {
  received: number;
  pending: number;
  notCredited: number;
};

type Props = {
  stats: DailyQStats;
};

export default function DailyQStatsSection({ stats }: Props) {
  const navigate = useNavigate();

  return (
    <section className="mt-6 border-t border-[#dfdfdf] pt-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[12px] font-bold tracking-wide text-[#78716D]">DAILY Q HISTORY</h2>
        <button
          type="button"
          onClick={() => navigate("/daily-q/history")}
          className="text-[12px] font-medium text-[#10314f]"
        >
          View History →
        </button>
      </div>

      <div className="flex rounded-xl border border-[#c9c9c9] bg-[#f4f4f4]">
        <StatCell value={stats.received} label="Received" color="#2D7A2D" />
        <div className="my-3 w-px bg-[#d5d5d5]" />
        <StatCell value={stats.pending} label="Pending" color="#B35900" />
        <div className="my-3 w-px bg-[#d5d5d5]" />
        <StatCell value={stats.notCredited} label="Not Credited" color="#C0392B" />
      </div>
    </section>
  );
}

function StatCell({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="flex-1 py-3 text-center">
      <p className="text-[24px] font-bold leading-none" style={{ color }}>
        {value}
      </p>
      <p className="mt-1 text-[12px]" style={{ color }}>
        {label}
      </p>
    </div>
  );
}
