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
    footer: {
      initials: careaiMockAgent.initials,
      name: careaiMockAgent.accountName,
      role: careaiMockAgent.organization,
    },
  },
  patient: {
    getSections: getPatientNavSections,
    footer: {
      initials: careaiMockMember.initials,
      role: careaiMockMember.accountLabel,
    },
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
  const { getSections, footer } = PORTALS[portal];

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
        footer={footer}
      />
      <main className={careaiPortal.main}>{children}</main>
    </div>
  );
}
