type Props = {
  title: string;
  subtitle?: string;
};

export default function ScreenTitle({ title, subtitle }: Props) {
  return (
    <header className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {subtitle ? <p className="text-gray-500 mt-2 text-sm leading-relaxed">{subtitle}</p> : null}
    </header>
  );
}
