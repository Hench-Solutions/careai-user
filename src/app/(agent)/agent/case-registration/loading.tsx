import { AgentCrumbTopbar } from "@/components/portal/agent-crumb-topbar";
import { PageHeader } from "@/components/portal/page-header";
import { PortalContent } from "@/components/portal/portal-content";
import { RegistrationListSkeleton } from "@/components/portal/portal-loading-fallbacks";

export default function CaseRegistrationLoading() {
  return (
    <>
      <AgentCrumbTopbar label="Case Registration" />
      <PortalContent>
        <PageHeader
          title="Case Registration"
          subtitle="View and update the cases you have registered."
        />
        <RegistrationListSkeleton />
      </PortalContent>
    </>
  );
}
