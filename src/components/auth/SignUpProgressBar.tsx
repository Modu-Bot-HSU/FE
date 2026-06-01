type Props = {
  step: 1 | 2 | 3;
};

export default function SignUpProgressBar({ step }: Props) {
  return (
    <div className="mb-8 flex items-center gap-2">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={`rounded-full ${i === step ? "h-2 w-10 bg-[#0F253E]" : "h-2 w-2 bg-[#D1D1D1]"}`}
        />
      ))}
    </div>
  );
}
