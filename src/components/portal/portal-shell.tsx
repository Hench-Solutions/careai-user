"use client";

import { usePathname } from "next/navigation";

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

  return (
    <div
      className={cn(
        urbanist.variable,
        careaiPortal.root,
        `careai-portal--${portal}`,
      )}
    >
      <PortalSidebar
        logoVariant={portal}
        sections={getSections(pathname)}
        footerRole={footerRole}
      />
      <main className={careaiPortal.main}>{children}</main>
    </div>
  );
}
