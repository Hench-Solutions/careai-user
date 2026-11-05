import type { Metadata } from "next";

import { AgentCrumbTopbar } from "@/components/portal/agent-crumb-topbar";
import { AgentCaseStatusContent } from "@/components/portal/agent-pages/AgentCaseStatusContent";

export const metadata: Metadata = {
  title: "Case Status",
};

export default function AgentCaseStatusPage() {
  return (
    <>
      <AgentCrumbTopbar label="Case Status" />
      <div className="lm-content">
        <AgentCaseStatusContent />
      </div>
    </>
  );
}
