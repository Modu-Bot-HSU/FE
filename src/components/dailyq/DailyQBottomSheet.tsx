import type { ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
};

export default function DailyQBottomSheet({ open, onClose, children, title }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/45"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg rounded-t-[24px] bg-white px-6 pb-8 pt-3 shadow-2xl">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#D1D1D1]" />
        {title ? (
          <h2 className="mb-5 text-center font-serif text-[22px] font-bold text-[#0F253E]">{title}</h2>
        ) : null}
        {children}
      </div>
    </div>
  );
}
