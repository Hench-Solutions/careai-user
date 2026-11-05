"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

import { PortalSidebar } from "@/components/portal/portal-sidebar";
import { careaiMockAgent } from "@/config/careai-mock";
import { getAgentNavSections } from "@/config/portal-navigation";
import { useRequireCareaiSession } from "@/hooks/use-require-careai-session";
import { careaiPortal } from "@/lib/careai/classes";
import { urbanist } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export function AgentPortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const sections = getAgentNavSections(pathname);
  const sidebarFooter = useMemo(
    () => ({
      initials: careaiMockAgent.initials,
      name: careaiMockAgent.accountName,
      role: careaiMockAgent.organization,
    }),
    [],
  );
  useRequireCareaiSession("agent");

  return (
    <div
      className={cn(
        urbanist.variable,
        careaiPortal.root,
        "careai-portal--agent",
      )}
    >
      <PortalSidebar
        logoVariant="agent"
        sections={sections}
        footer={sidebarFooter}
      />
      <main className={careaiPortal.main}>{children}</main>
    </div>
  );
}
