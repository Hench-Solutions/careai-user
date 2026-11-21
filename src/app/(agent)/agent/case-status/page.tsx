import { Suspense } from "react";

import type { Metadata } from "next";

import { AgentCrumbTopbar } from "@/components/portal/agent-crumb-topbar";
import { CaseStatusData } from "@/components/portal/agent-pages/CaseStatusData";
import { PageHeader } from "@/components/portal/page-header";
import { PortalContent } from "@/components/portal/portal-content";
import { CaseStatusSkeleton } from "@/components/portal/portal-loading-fallbacks";
import { LEAD_STAGES } from "@/config/lead";

export const metadata: Metadata = {
  title: "Case Status",
};

export default function AgentCaseStatusPage() {
  return (
    <>
      <AgentCrumbTopbar label="Case Status" />
      <PortalContent>
        <PageHeader
          title="Case Status"
          subtitle={`Track your open cases through ${LEAD_STAGES.map((stage) => stage.label).join(", ")}.`}
        />
        <Suspense fallback={<CaseStatusSkeleton />}>
          <CaseStatusData />
        </Suspense>
      </PortalContent>
    </>
  );
}
