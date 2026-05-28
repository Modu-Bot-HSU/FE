import { AUTH } from "./authTheme";

type Props = {
  /** 1–3: current signup step */
  current: 1 | 2 | 3;
};

/** Figma: three horizontal bars, leading segments filled through current step */
export default function SignUpProgress({ current }: Props) {
  return (
    <div className="flex gap-1.5 mb-8" role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={3}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-1 flex-1 rounded-full transition-colors"
          style={{
            backgroundColor: i <= current ? AUTH.navy : AUTH.border,
          }}
        />
      ))}
    </div>
  );
}
