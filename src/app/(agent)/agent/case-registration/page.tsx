import type { Metadata } from "next";

import { AgentCrumbTopbar } from "@/components/portal/agent-crumb-topbar";
import { AgentCaseRegistrationContent } from "@/components/portal/agent-pages/AgentCaseRegistrationContent";

export const metadata: Metadata = {
  title: "Case Registration",
};

export default function AgentCaseRegistrationPage() {
  return (
    <>
      <AgentCrumbTopbar label="Case Registration" />
      <div className="lm-content case-registration-page">
        <AgentCaseRegistrationContent />
      </div>
    </>
  );
}
