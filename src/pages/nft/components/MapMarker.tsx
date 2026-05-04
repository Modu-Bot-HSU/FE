type MapMarkerProps = {
  label: string;
  x: string;
  y: string;
  isSold: boolean;
  isSelected: boolean;
  onClick: () => void;
};

export default function MapMarker({
  label,
  x,
  y,
  isSold,
  isSelected,
  onClick,
}: MapMarkerProps) {
  return (
    <button
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-1 text-sm shadow transition ${
        isSelected
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white/95 text-slate-800"
      }`}
      style={{ left: x, top: y }}
    >
      <span className="inline-flex items-center gap-1.5">
        {label}
        {isSold && <span className="h-2 w-2 rounded-full bg-orange-500" />}
      </span>
    </button>
  );
}
