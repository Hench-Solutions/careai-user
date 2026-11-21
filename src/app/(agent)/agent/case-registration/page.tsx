import { Suspense } from "react";

import type { Metadata } from "next";

import { AgentCrumbTopbar } from "@/components/portal/agent-crumb-topbar";
import { RegistrationList } from "@/components/portal/agent-pages/RegistrationList";
import { PageHeader } from "@/components/portal/page-header";
import { PortalContent } from "@/components/portal/portal-content";
import { RegistrationListSkeleton } from "@/components/portal/portal-loading-fallbacks";

export const metadata: Metadata = {
  title: "Case Registration",
};

export default function AgentManageRegistrationPage({
  searchParams,
}: {
  searchParams: Promise<{ by?: string; q?: string }>;
}) {
  return (
    <>
      <AgentCrumbTopbar label="Case Registration" />
      <PortalContent>
        <PageHeader
          title="Case Registration"
          subtitle="View and update the cases you have registered."
        />
        <Suspense fallback={<RegistrationListSkeleton />}>
          <RegistrationList searchParams={searchParams} />
        </Suspense>
      </PortalContent>
    </>
  );
}
