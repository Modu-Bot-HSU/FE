import { createContext, ReactNode, useState } from "react";

type SidebarContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}
