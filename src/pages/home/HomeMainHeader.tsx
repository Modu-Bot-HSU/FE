type Props = {
  onMenu?: () => void;
};

export default function HomeMainHeader({ onMenu }: Props) {
  return (
    <header className="shrink-0 pt-2 pb-4">
      <button
        type="button"
        onClick={onMenu}
        className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm border border-gray-100 text-[#001F3F]"
        aria-label="Open menu"
      >
        <span className="flex flex-col gap-1">
          <span className="block h-0.5 w-4 rounded-full bg-current" />
          <span className="block h-0.5 w-3 rounded-full bg-current" />
          <span className="block h-0.5 w-5 rounded-full bg-current" />
        </span>
      </button>
    </header>
  );
}
