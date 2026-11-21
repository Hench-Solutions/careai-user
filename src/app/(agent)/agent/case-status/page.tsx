import type { Metadata } from "next";

import { AgentCrumbTopbar } from "@/components/portal/agent-crumb-topbar";
import { AgentCaseStatusContent } from "@/components/portal/agent-pages/AgentCaseStatusContent";
import { PortalContent } from "@/components/portal/portal-content";

export const metadata: Metadata = {
  title: "Case Status",
};

export default function AgentCaseStatusPage() {
  return (
    <>
      <AgentCrumbTopbar label="Case Status" />
      <PortalContent>
        <AgentCaseStatusContent />
      </PortalContent>
    </>
  );
}
