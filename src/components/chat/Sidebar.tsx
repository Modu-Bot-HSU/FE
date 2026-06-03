import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import logoUrl from "../../assets/logo.svg";
import { useAuthStore } from "../../store/useAuthStore";
import { useMyPageQuery } from "../../features/profile/useMyPageQuery";

type Props = {
  open: boolean;
  onClose: () => void;
};

const menuSections = [
  {
    title: "MAIN",
    items: [{ label: "Chat", to: "/chat" }, { label: "Daily Q", to: "/daily-q" }],
  },
  {
    title: "CAMPUS",
    items: [{ label: "Campus Map", to: "/campus" }, { label: "Collection", to: "/campus/collection" }],
  },
  {
    title: "ACCOUNT",
    items: [{ label: "Profile", to: "/profile" }],
  },
] as const;

export default function HomeSidebar({ open, onClose }: Props) {
  const asideRef = useRef<HTMLElement | null>(null);
  const tempUser = useAuthStore((state) => state.tempUser);
  const accessToken = localStorage.getItem("accessToken") ?? undefined;
  const myPageQuery = useMyPageQuery(accessToken);
  const userEmail = myPageQuery.data?.email ?? tempUser?.email ?? "";

  useEffect(() => {
    if (open) return;

    const active = document.activeElement;
    if (active instanceof HTMLElement && asideRef.current?.contains(active)) {
      active.blur();
    }
  }, [open]);

  return (
    <>
      <div
        className={`absolute inset-0 z-[91] bg-black/20 transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        ref={asideRef}
        className={`absolute left-0 top-0 z-[92] h-full w-[86vw] max-w-[340px] bg-[#F5F5F5] px-6 py-8 shadow-xl transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}
        aria-hidden={!open}
      >
        <div className="mb-8">
          <img src={logoUrl} alt="UniMint" className="h-9 w-auto" />
          <p className="mt-2 text-base text-[#5f6776]">{userEmail || "-"}</p>
        </div>

        <nav className="space-y-6">
          {menuSections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-2 text-xs font-semibold tracking-[0.12em] text-gray-500">{section.title}</h2>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <NavLink
                      to={item.to}
                      end={item.to === "/campus"}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center rounded-2xl px-3 py-2.5 text-sm font-semibold text-black ${
                          isActive ? "bg-[#d9d7d7]" : ""
                        }`
                      }
                    >
                      <span className="mr-3 text-xl leading-none">•</span>
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>
      </aside>
    </>
  );
}
