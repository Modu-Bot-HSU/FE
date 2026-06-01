type Props = {
  total?: number;
  activeIndex?: number;
};

export default function DailyQProgressDots({ total = 4, activeIndex = 1 }: Props) {
  return (
    <div className="mb-8 flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-full ${i === activeIndex ? "bg-[#0F253E]" : "bg-[#D1D1D1]"}`}
        />
      ))}
    </div>
  );
}
