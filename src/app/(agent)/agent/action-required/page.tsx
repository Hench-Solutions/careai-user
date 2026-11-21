import { Suspense } from "react";

import type { Metadata } from "next";

import { AgentCrumbTopbar } from "@/components/portal/agent-crumb-topbar";
import { ActionRequiredData } from "@/components/portal/agent-pages/ActionRequiredData";
import { PageHeader } from "@/components/portal/page-header";
import { PortalContent } from "@/components/portal/portal-content";
import { CardListSkeleton } from "@/components/portal/portal-loading-fallbacks";

export const metadata: Metadata = {
  title: "Action Required",
};

export default function AgentActionRequiredPage() {
  return (
    <>
      <AgentCrumbTopbar label="Action Required" />
      <PortalContent>
        <PageHeader
          title="Action Required"
          subtitle="Items across your cases that are waiting on you: more information or missing documents."
        />
        <Suspense fallback={<CardListSkeleton />}>
          <ActionRequiredData />
        </Suspense>
      </PortalContent>
    </>
  );
}
