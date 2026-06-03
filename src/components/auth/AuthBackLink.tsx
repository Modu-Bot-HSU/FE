type Props = {
  onClick: () => void;
};

export default function AuthBackLink({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-6 w-full py-2 text-center text-sm font-medium text-[#717171]"
    >
      ← Back
    </button>
  );
}
