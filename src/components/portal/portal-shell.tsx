"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { Menu } from "lucide-react";

import { PortalSidebar } from "@/components/portal/portal-sidebar";
import {
  getAgentNavSections,
  getPatientNavSections,
} from "@/config/portal-navigation";
import { urbanist } from "@/lib/fonts";
import { cn } from "@/lib/utils";

const backdropClass = (show: boolean) =>
  cn(
    "lm-backdrop hidden",
    show &&
      "max-[900px]:fixed max-[900px]:inset-0 max-[900px]:z-[49] max-[900px]:block max-[900px]:bg-[rgba(26,26,46,0.4)]",
  );

const PORTALS = {
  agent: {
    getSections: getAgentNavSections,
    footerRole: "Agent",
  },
  patient: {
    getSections: getPatientNavSections,
    footerRole: "Patient",
  },
} as const;

export function PortalShell({
  portal,
  children,
}: {
  portal: keyof typeof PORTALS;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { getSections, footerRole } = PORTALS[portal];
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const navOpen = openedOn === pathname;

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenedOn(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [navOpen]);

  return (
    <div
      className={cn(
        urbanist.variable,
        "careai-portal box-border flex min-h-dvh bg-care-bg font-[family-name:var(--font-urbanist),Urbanist,ui-sans-serif,system-ui,sans-serif] text-care-ink [&_*]:box-border [&_*::after]:box-border [&_*::before]:box-border [&_button]:font-[inherit] [&_input]:font-[inherit] [&_select]:font-[inherit] [&_textarea]:font-[inherit]",
        `careai-portal--${portal}`,
      )}
    >
      <button
        type="button"
        className="lm-menu-btn hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-care-purple max-[900px]:fixed max-[900px]:top-3 max-[900px]:left-3 max-[900px]:z-[45] max-[900px]:flex max-[900px]:size-[42px] max-[900px]:items-center max-[900px]:justify-center max-[900px]:rounded-xl max-[900px]:border max-[900px]:border-care-line max-[900px]:bg-white max-[900px]:text-care-purple max-[900px]:shadow-care"
        aria-label="Open menu"
        aria-expanded={navOpen}
        aria-controls="portal-nav"
        onClick={() => setOpenedOn(pathname)}
      >
        <Menu aria-hidden size={20} />
      </button>
      <div
        className={backdropClass(navOpen)}
        onClick={() => setOpenedOn(null)}
        aria-hidden
      />
      <PortalSidebar
        id="portal-nav"
        open={navOpen}
        onClose={() => setOpenedOn(null)}
        logoVariant={portal}
        sections={getSections(pathname)}
        footerRole={footerRole}
      />
      <main className="lm-main ml-[260px] min-w-0 flex-1 max-[900px]:ml-0">
        {children}
      </main>
    </div>
  );
}
