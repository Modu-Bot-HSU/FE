import { useEffect, useRef, useState, type ReactNode } from "react";

type AnimatedBottomSheetProps = {
  open: boolean;
  onBackdropClick: () => void;
  children: ReactNode;
  durationMs?: number;
  onExited?: () => void;
};

export default function AnimatedBottomSheet({
  open,
  onBackdropClick,
  children,
  durationMs = 280,
  onExited,
}: AnimatedBottomSheetProps) {
  const [shouldRender, setShouldRender] = useState(open);
  const [visible, setVisible] = useState(false);
  const [frameScrollTop, setFrameScrollTop] = useState(0);
  const closeTimeoutRef = useRef<number | null>(null);
  const openRaf1Ref = useRef<number | null>(null);
  const openRaf2Ref = useRef<number | null>(null);

  useEffect(() => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    if (openRaf1Ref.current) {
      window.cancelAnimationFrame(openRaf1Ref.current);
      openRaf1Ref.current = null;
    }
    if (openRaf2Ref.current) {
      window.cancelAnimationFrame(openRaf2Ref.current);
      openRaf2Ref.current = null;
    }

    if (open) {
      setShouldRender(true);
      setVisible(false);
      openRaf1Ref.current = window.requestAnimationFrame(() => {
        openRaf2Ref.current = window.requestAnimationFrame(() => {
          setVisible(true);
          openRaf2Ref.current = null;
        });
        openRaf1Ref.current = null;
      });
      return;
    }

    setVisible(false);
    closeTimeoutRef.current = window.setTimeout(() => {
      setShouldRender(false);
      onExited?.();
      closeTimeoutRef.current = null;
    }, durationMs);

    return () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
      if (openRaf1Ref.current) {
        window.cancelAnimationFrame(openRaf1Ref.current);
        openRaf1Ref.current = null;
      }
      if (openRaf2Ref.current) {
        window.cancelAnimationFrame(openRaf2Ref.current);
        openRaf2Ref.current = null;
      }
    };
  }, [open, durationMs, onExited]);

  useEffect(() => {
    if (!shouldRender) return;

    const frameEl = document.querySelector(".mobile-frame") as HTMLElement | null;
    if (!frameEl) {
      setFrameScrollTop(0);
      return;
    }

    const syncScrollOffset = () => {
      setFrameScrollTop(frameEl.scrollTop);
    };

    syncScrollOffset();
    frameEl.addEventListener("scroll", syncScrollOffset, { passive: true });
    window.addEventListener("resize", syncScrollOffset);

    return () => {
      frameEl.removeEventListener("scroll", syncScrollOffset);
      window.removeEventListener("resize", syncScrollOffset);
    };
  }, [shouldRender]);

  if (!shouldRender) return null;

  return (
    <div
      className="fixed inset-0 z-[79]"
      style={frameScrollTop ? { transform: `translateY(${frameScrollTop}px)` } : undefined}
    >
      <div
        className={`absolute inset-0 z-[1] bg-black/25 transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onBackdropClick}
      />

      <div
        className={`pointer-events-none absolute inset-0 z-[2] flex items-end justify-center transition-all duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className={`pointer-events-auto w-full max-w-[430px] transition-transform duration-300 ${
            visible ? "translate-y-0" : "translate-y-8"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}