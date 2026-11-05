"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

import { PortalSidebar } from "@/components/portal/portal-sidebar";
import { careaiMockMember } from "@/config/careai-mock";
import { getPatientNavSections } from "@/config/portal-navigation";
import { useRequireCareaiSession } from "@/hooks/use-require-careai-session";
import { careaiPortal } from "@/lib/careai/classes";
import { urbanist } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export function PatientPortalShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const sections = getPatientNavSections(pathname);
  const sidebarFooter = useMemo(
    () => ({
      initials: careaiMockMember.initials,
      role: careaiMockMember.accountLabel,
    }),
    [],
  );
  useRequireCareaiSession("patient");

  return (
    <div
      className={cn(
        urbanist.variable,
        careaiPortal.root,
        "careai-portal--patient",
      )}
    >
      <PortalSidebar
        logoVariant="patient"
        sections={sections}
        footer={sidebarFooter}
      />
      <main className={careaiPortal.main}>{children}</main>
    </div>
  );
}
