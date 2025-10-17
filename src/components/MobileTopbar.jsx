// src/components/MobileTopbar.jsx


import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import LogoutButton from "@/components/LogoutButton";

export default function MobileTopbar() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="md:hidden flex items-center gap-2 border-b bg-background px-3 h-12">
        <button aria-label="Ouvrir la navigation"
                onClick={() => setOpen(true)}
                className="px-2 py-1 rounded-lg border">☰</button>
        <div className="font-medium">Menu</div>
      </div>
      {open && (
        <div className="md:hidden fixed inset-0 z-50 bg-[#f8f5f0]" onClick={() => setOpen(false)}>
          <div className="absolute left-0 top-0 bottom-0 w-80 h-full bg-[#f8f5f0] p-3 text-black"
               onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">Navigation</div>
              <button aria-label="Fermer" onClick={() => setOpen(false)}
                      className="px-2 py-1 rounded-lg border text-black">✕</button>
            </div>
            <AppSidebar compact />
            <div className="mt-4 pt-4 border-t">
              <LogoutButton />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
