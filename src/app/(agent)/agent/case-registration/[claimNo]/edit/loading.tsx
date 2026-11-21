import { AgentCrumbTopbar } from "@/components/portal/agent-crumb-topbar";
import { PortalContent } from "@/components/portal/portal-content";
import { RegistrationWizardSkeleton } from "@/components/portal/portal-loading-fallbacks";

export default function EditRegistrationLoading() {
  return (
    <>
      <AgentCrumbTopbar label="Case Registration" />
      <PortalContent wizard>
        <RegistrationWizardSkeleton />
      </PortalContent>
    </>
  );
}
