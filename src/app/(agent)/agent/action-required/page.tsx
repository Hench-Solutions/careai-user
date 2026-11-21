import type { Metadata } from "next";

import { AgentCrumbTopbar } from "@/components/portal/agent-crumb-topbar";
import { AgentActionRequiredContent } from "@/components/portal/agent-pages/AgentActionRequiredContent";
import { PortalContent } from "@/components/portal/portal-content";

export const metadata: Metadata = {
  title: "Action Required",
};

export default function AgentActionRequiredPage() {
  return (
    <>
      <AgentCrumbTopbar label="Action Required" />
      <PortalContent>
        <AgentActionRequiredContent />
      </PortalContent>
    </>
  );
}
