import type { Metadata } from "next";

import { AgentCrumbTopbar } from "@/components/portal/agent-crumb-topbar";
import { AgentActionRequiredContent } from "@/components/portal/agent-pages/AgentActionRequiredContent";

export const metadata: Metadata = {
  title: "Action Required",
};

export default function AgentActionRequiredPage() {
  return (
    <>
      <AgentCrumbTopbar label="Action Required" />
      <div className="lm-content">
        <AgentActionRequiredContent />
      </div>
    </>
  );
}
