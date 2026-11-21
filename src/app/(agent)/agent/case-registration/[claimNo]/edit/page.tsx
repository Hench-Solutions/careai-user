import { Suspense } from "react";

import type { Metadata } from "next";

import { AgentCrumbTopbar } from "@/components/portal/agent-crumb-topbar";
import { RegistrationEdit } from "@/components/portal/agent-pages/RegistrationEdit";
import { PortalContent } from "@/components/portal/portal-content";
import { RegistrationWizardSkeleton } from "@/components/portal/portal-loading-fallbacks";

export const metadata: Metadata = {
  title: "Edit registration",
};

export default function AgentRegistrationEditPage({
  params,
}: {
  params: Promise<{ claimNo: string }>;
}) {
  return (
    <>
      <AgentCrumbTopbar label="Case Registration" />
      <PortalContent wizard>
        <Suspense fallback={<RegistrationWizardSkeleton />}>
          <RegistrationEdit params={params} />
        </Suspense>
      </PortalContent>
    </>
  );
}
