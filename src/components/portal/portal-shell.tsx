"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { Menu } from "lucide-react";

import { PortalSidebar } from "@/components/portal/portal-sidebar";
import { careaiMockAgent, careaiMockMember } from "@/config/careai-mock";
import {
  getAgentNavSections,
  getPatientNavSections,
} from "@/config/portal-navigation";
import { careaiPortal } from "@/lib/careai/classes";
import { urbanist } from "@/lib/fonts";
import { cn } from "@/lib/utils";

const PORTALS = {
  agent: {
    getSections: getAgentNavSections,
    footerRole: careaiMockAgent.organization,
  },
  patient: {
    getSections: getPatientNavSections,
    footerRole: careaiMockMember.accountLabel,
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
  // The phone menu is open only on the page it was opened on, so choosing a link closes it.
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
        careaiPortal.root,
        `careai-portal--${portal}`,
      )}
    >
      <button
        type="button"
        className="lm-menu-btn"
        aria-label="Open menu"
        aria-expanded={navOpen}
        aria-controls="portal-nav"
        onClick={() => setOpenedOn(pathname)}
      >
        <Menu aria-hidden size={20} />
      </button>
      <div
        className={cn("lm-backdrop", navOpen && "show")}
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
      <main className={careaiPortal.main}>{children}</main>
    </div>
  );
}
