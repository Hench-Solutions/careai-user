import type { Metadata } from "next";

import { AgentCrumbTopbar } from "@/components/portal/agent-crumb-topbar";
import { AgentCaseRegistrationContent } from "@/components/portal/agent-pages/AgentCaseRegistrationContent";
import { PortalContent } from "@/components/portal/portal-content";

export const metadata: Metadata = {
  title: "New Registration",
};

export default function AgentCaseRegistrationPage() {
  return (
    <>
      <AgentCrumbTopbar label="Case Registration" />
      <PortalContent wizard>
        <AgentCaseRegistrationContent />
      </PortalContent>
    </>
  );
}
