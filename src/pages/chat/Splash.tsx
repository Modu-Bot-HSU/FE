import logoUrl from "../../assets/logo.svg";

export default function HomeSplash() {
  return (
    <div className="min-h-[calc(100vh-0px)] flex items-center justify-center bg-[#F5F5F5]">
      <img src={logoUrl} alt="ModuBot" className="w-[min(72vw,260px)] h-auto select-none" />
    </div>
  );
}
