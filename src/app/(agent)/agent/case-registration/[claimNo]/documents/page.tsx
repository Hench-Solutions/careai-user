import { Suspense } from "react";

import type { Metadata } from "next";

import { AgentCrumbTopbar } from "@/components/portal/agent-crumb-topbar";
import { CaseDocuments } from "@/components/portal/agent-pages/CaseDocuments";
import { PortalContent } from "@/components/portal/portal-content";
import { CardListSkeleton } from "@/components/portal/portal-loading-fallbacks";

export const metadata: Metadata = {
  title: "Upload documents",
};

export default function AgentCaseDocumentsPage({
  params,
}: {
  params: Promise<{ claimNo: string }>;
}) {
  return (
    <>
      <AgentCrumbTopbar label="Action Required" />
      <PortalContent>
        <Suspense fallback={<CardListSkeleton />}>
          <CaseDocuments params={params} />
        </Suspense>
      </PortalContent>
    </>
  );
}
