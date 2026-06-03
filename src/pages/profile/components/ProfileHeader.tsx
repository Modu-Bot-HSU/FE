type Props = {
  name: string;
  email: string;
  balance: string;
  buildingCount: number;
};

export default function ProfileHeader({ name, email, balance, buildingCount }: Props) {
  const initials = (name || "?")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className="mt-6">
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border-[0.5px] border-[#A8A29F] bg-[#D6D3D1] text-[34px] font-bold text-[#A8A29F]">
          {initials}
        </div>
        <div>
          <h1 className="text-[28px] font-semibold leading-none text-[#002A47]">{name}</h1>
          <p className="mt-2 text-[14px] text-[#A8A29F]">{email}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-[#c9c9c9] bg-[#f4f4f4] px-3 py-3 text-center">
          <p className="text-[24px] font-semibold leading-none text-[#002A47]">{balance}</p>
          <p className="mt-1 text-[12px] text-[#78716D]">Tokens Balance</p>
        </div>
        <div className="rounded-xl border border-[#c9c9c9] bg-[#f4f4f4] px-3 py-3 text-center">
          <p className="text-[24px] font-semibold leading-none text-[#002A47]">{buildingCount}</p>
          <p className="mt-1 text-[12px] text-[#78716D]">My Buildings</p>
        </div>
      </div>
    </section>
  );
}
